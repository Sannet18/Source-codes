<!-- <script setup>
import { ref, computed } from 'vue'
import { useMessageStore } from '../stores/messageStore.js'
import Message from '@/models/Message.js'

const messageStore = useMessageStore()

const currentUser = computed(() => messageStore.selectedUser)
// Input for new message
const newMessage = ref('')

function sendMessage() {
  if (!newMessage.value.trim()) return

  const msg = new Message({
    id: messageStore.messages.length + 1,
    username: currentUser.value.username,
    firstName: currentUser.value.firstName,
    lastName: currentUser.value.lastName,
    message: newMessage.value,
    redacted: false,
  })

  messageStore.add(msg)
  newMessage.value = ''
}
console.log(messageStore.receiver.firstName)
console.log(currentUser.value.username)
console.log(messageStore.sender.firstName)

function logout() {
  messageStore.selectedUser = null
  localStorage.removeItem('selectedUser')
}
</script>

<template>
  <div id="messenger-container">
    <div id="messenger-header">
      <button @click="logout" class="logout-btn">Logout</button>
    </div>
    <div
      v-for="msg in messageStore.messages"
      :key="msg.id"
      class="message-row"
      :class="{
        'my-message': msg.username === currentUser.username,
        'other-message': msg.username !== currentUser.username,
      }"
    >
      <div class="message-bubble">
        <div class="author">{{ msg.firstName }}</div>

        <div class="text">
          {{ msg.redacted ? 'Message Redacted' : msg.message }}
        </div>

        <div v-if="msg.username === currentUser.username" class="controls">
          <button v-if="!msg.redacted" @click="messageStore.redact(msg.id, currentUser.username)">
            Redact
          </button>
          <button v-if="msg.redacted" @click="messageStore.unredact(msg.id, currentUser.username)">
            Unredact
          </button>
        </div>
      </div>
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
</template>

<style scoped>
#messenger-header {
  display: flex;
}
#messenger-header > button {
  width: 80px;
  height: 40px;
  border-radius: 999px;
  margin-left: auto;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  padding: 8px 12px;
  border: none;
  cursor: pointer;
}
#messenger-header > button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
}
#messenger-container {
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 10px;
  height: 100vh;
  background: linear-gradient(90deg, red, green);
  background-color: #f2f2f2;
  overflow-y: auto;
}

.message-row {
  display: flex;
}
.my-message {
  justify-content: flex-end;
}

.other-message {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 60%;
  padding: 10px 15px;
  border-radius: 16px;
  background-color: #e5e5ea;
}

.my-message .message-bubble {
  background-color: #007aff;
  color: white;
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
  margin-top: 10px;
}

#message-input-container input {
  flex: 1;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

#message-input-container button {
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  background-color: #007aff;
  color: white;
  cursor: pointer;
}

#message-input-container button:hover {
  background-color: #005fcc;
}
</style> -->

<script setup>
import { ref, computed } from 'vue'
import { useMessageStore } from '../stores/messageStore.js'
import Message from '@/models/Message.js'

const messageStore = useMessageStore()
const currentUser = computed(() => messageStore.selectedUser)
const newMessage = ref('')

function sendMessage() {
  if (!newMessage.value.trim()) return
  if (!currentUser.value) return

  const maxId = Math.max(0, ...messageStore.messages.map((m) => m.id))
  const msg = new Message({
    id: maxId + 1,
    username: currentUser.value.username,
    firstName: currentUser.value.firstName,
    lastName: currentUser.value.lastName,
    message: newMessage.value,
  })

  messageStore.add(msg)
  newMessage.value = ''
}

function handleBubbleClick(msg) {
  if (!currentUser.value) return

  if (msg.username === currentUser.value.username) {
    if (msg.redacted) {
      messageStore.unredact(msg.id, currentUser.value.username)
    } else {
      messageStore.redact(msg.id, currentUser.value.username)
    }
  }
}

function logout() {
  messageStore.selectedUser = null
  localStorage.removeItem('selectedUser')
}
</script>

<template>
  <div id="messenger-container">
    <div id="messenger-header">
      <button @click="logout" class="logout-btn">Logout</button>
    </div>

    <div
      v-for="msg in messageStore.messages"
      :key="msg.id"
      class="message-row"
      :class="{
        'my-message': currentUser && msg.username === currentUser.username,
        'other-message': currentUser && msg.username !== currentUser.username,
      }"
    >
      <div
        class="message-bubble"
        :class="{ 'own-message': currentUser && msg.username === currentUser.username }"
        @click="handleBubbleClick(msg)"
      >
        <div class="author">{{ msg.firstName }}</div>

        <div class="text">
          {{ msg.redacted ? 'Message Redacted' : msg.message }}
        </div>
      </div>
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
</template>

<style scoped>
#messenger-header {
  display: flex;
}

#messenger-header > button {
  width: 80px;
  height: 40px;
  border-radius: 999px;
  margin-left: auto;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  padding: 8px 12px;
  border: none;
  cursor: pointer;
  background-color: #ff3b30;
  color: white;
  font-weight: bold;
}

#messenger-header > button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
}

#messenger-container {
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 10px;
  height: 100vh;
  background-color: #f2f2f2;
  overflow-y: auto;
}

.message-row {
  display: flex;
}

.my-message {
  justify-content: flex-end;
}

.other-message {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 60%;
  padding: 10px 15px;
  border-radius: 16px;
  background-color: #e5e5ea;
  word-wrap: break-word;
}

.my-message .message-bubble {
  background-color: #007aff;
  color: white;
}

.message-bubble.own-message {
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.message-bubble.own-message:hover {
  opacity: 0.8;
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
  padding: 20px;
  background-color: #f2f2f2;
  margin-top: auto;
}

#message-input-container input {
  flex: 1;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

#message-input-container button {
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  background-color: #007aff;
  color: white;
  cursor: pointer;
  font-weight: bold;
}

#message-input-container button:hover {
  background-color: #005fcc;
}
</style>
