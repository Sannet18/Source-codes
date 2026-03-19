<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useMessageStore } from '@/stores/messageStore'
import { useUserStore } from '@/stores/userStore'
import { useRoute } from 'vue-router'

const messageStore = useMessageStore()
const userStore = useUserStore()
const route = useRoute()

const newMessage = ref('')
const chatContainer = ref(null)

const currentUser = computed(() => userStore.currentUser)
const selectedFriend = computed(() => userStore.selectedFriend)

const chatMessages = computed(() => {
  if (!selectedFriend.value) return []
  return messageStore.messagesWithUsers(selectedFriend.value.id)
})

watch(
  () => route.params.username,
  (username) => {
    if (!username || !userStore.currentUser) return
    const friend = userStore.users.find((u) => u.username === username)
    if (friend) {
      userStore.selectFriend(friend.id)
    }
  },
  { immediate: true },
)

function sendMessage() {
  if (!newMessage.value.trim() || !selectedFriend.value) return
  messageStore.add(newMessage.value, selectedFriend.value.id)
  newMessage.value = ''
}

// To scroll to the bottom(ova here)
async function scrollToBottom() {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}
watch(chatMessages, scrollToBottom, { deep: true })

onMounted(scrollToBottom)

function handleBubbleClick(msg) {
  if (!currentUser.value) return
  if (msg.userId === currentUser.value.id) {
    msg.redacted ? messageStore.unredact(msg.id) : messageStore.redact(msg.id)
  }
}
</script>

<template>
  <div id="messenger-container" v-if="selectedFriend">
    <h2>Chat with {{ selectedFriend.username }}</h2>

    <div ref="chatContainer" class="chat-messages">
      <div v-for="msg in chatMessages" :key="msg.id" class="message-row">
        <div
          class="message-bubble"
          :class="{ 'own-message': msg.userId === currentUser.id }"
          @click="handleBubbleClick(msg)"
        >
          <div class="text">
            {{ msg.redacted ? 'Message Redacted' : msg.message }}
          </div>
        </div>
      </div>

      <div v-if="chatMessages.length === 0" class="no-messages">Start the conversation!</div>
    </div>

    <div id="message-input-container">
      <input
        v-model="newMessage"
        type="text"
        placeholder="Type your message..."
        @keyup.enter="sendMessage"
      />
      <button @click="sendMessage">Send</button>
    </div>
  </div>

  <div v-else>
    <span>Select a friend to start chatting.</span>
  </div>
</template>

<style scoped>
#messenger-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #f2f2f2;
  height: 1%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message-row {
  display: flex;
  width: 100%;
}

.message-row:has(.own-message) {
  justify-content: flex-end;
}

.message-row:not(:has(.own-message)) {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 60%;
  padding: 10px 15px;
  border-radius: 16px;
  background-color: #e5e5ea;
  word-wrap: break-word;
  cursor: pointer;
  transition: opacity 0.2s ease;
  border-radius: 18px 18px 18px 4px;
}

.message-bubble:hover {
  opacity: 0.8;
}

.message-bubble.own-message {
  background-color: #3f3f41;
  color: white;
  border-radius: 18px 18px 4px 18px;
}

.author {
  font-size: 0.75rem;
  font-weight: bold;
  margin-bottom: 4px;
}

.text {
  font-size: 0.9rem;
  line-height: 1.3;
}

#message-input-container {
  display: flex;
  gap: 10px;
  padding: 15px;
  background-color: #f2f2f2;
  border-top: 1px solid #ddd;
  flex-shrink: 0;
}

#message-input-container input {
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

#message-input-container button {
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  background-color: #222831;
  color: white;
  cursor: pointer;
}

#message-input-container button:hover {
  background-color: #3f3f41;
}

.no-messages {
  text-align: center;
  color: #888;
}
</style>
