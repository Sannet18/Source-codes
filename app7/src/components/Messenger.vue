<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useMessageStore } from '@/stores/messageStore'
import { useUserStore } from '@/stores/userStore'
import { useRoute, useRouter } from 'vue-router'

const messageStore = useMessageStore()
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
let pollInterval = null

const newMessage = ref('')
const chatContainer = ref(null)

const currentUser = computed(() => userStore.currentUser)

const chatMessages = computed(() => {
  const groupId = route.params.id
  if (!groupId) return []

  return messageStore.messages.filter((msg) => String(msg.toId) === String(groupId))
})

function sendMessage() {
  const groupId = route.params.id
  if (!newMessage.value.trim() || !groupId) return

  messageStore.add(newMessage.value, groupId)
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
const messageInput = ref(null)
onMounted(async () => {
  messageInput.value?.focus()
  await messageStore.getMessages(route.params.id)
  console.log('currentUser._id:', currentUser.value?._id)
  console.log('first msg userId:', messageStore.messages[0]?.userId)

  await userStore.getUser()
  await userStore.getFriendRequests()
  await userStore.getFriends()

  pollInterval = setInterval(async () => {
    ;(await messageStore.getMessages(route.params.id),
      await userStore.getUser(),
      await userStore.getFriendRequests(),
      await userStore.getFriends())
  }, 3000)

  scrollToBottom()
})

onUnmounted(() => {
  if (pollInterval) {
    clearInterval(pollInterval)
  }
})

function handleBubbleClick(msg) {
  if (!currentUser.value) return
  if (msg.userId === currentUser.value._id) {
    msg.redacted ? messageStore.unredact(msg.id) : messageStore.redact(msg.id)
  }
}

// Invite modal state
const showInviteModal = ref(false)
const inviteSearch = ref('')
const inviteResults = ref([])
const inviteError = ref('')
const inviteLoading = ref(false)

let inviteSearchTimeout = null
async function onInviteSearch() {
  clearTimeout(inviteSearchTimeout)
  inviteError.value = ''
  if (!inviteSearch.value.trim()) {
    inviteResults.value = []
    return
  }
  inviteSearchTimeout = setTimeout(async () => {
    inviteLoading.value = true
    try {
      const results = await userStore.findUsers(inviteSearch.value.trim())
      inviteResults.value = results.filter((u) => u._id !== currentUser.value._id)
    } catch (err) {
      inviteError.value = '*Could not search users'
    } finally {
      inviteLoading.value = false
    }
  }, 400)
}

const currentGroup = computed(() =>
  messageStore.groupMessages.find((g) => String(g.id) === String(route.params.id)),
)
async function inviteUser(user) {
  const groupId = route.params.id
  inviteError.value = ''

  // Check if already a member
  const alreadyMember = currentGroup.value?.members?.some(
    (m) => String(m.user_id) === String(user._id),
  )
  if (alreadyMember) {
    inviteError.value = '*User is already in this group'
    return
  }

  try {
    await messageStore.chatInvite(groupId, user._id)
    inviteResults.value = inviteResults.value.filter((u) => u._id !== user._id)
    inviteSearch.value = ''
  } catch (err) {
    inviteError.value = `*${err.message}`
  }
}

function closeInviteModal() {
  showInviteModal.value = false
  inviteSearch.value = ''
  inviteResults.value = []
  inviteError.value = ''
}
console.log(messageStore.messages)

const groupName = computed(() => {
  const groupId = route.params.id
  return (
    messageStore.groupMessages.find((grp) => String(grp.id) === String(groupId))?.name ||
    'Group Chat'
  )
})

async function leaveGroup(chatId) {
  try {
    chatId = route.params.id
    await messageStore.leaveChat(chatId)
    await messageStore.fetchGroups()
    router.push('/home')
  } catch (err) {
    console.error(err)
  }
}

const isOwner = computed(() => {
  if (!currentGroup.value || !currentUser.value) return false
  return String(currentGroup.value.owner) === String(currentUser.value._id)
})
const showLeaveModal = ref(false)
const showMembers = ref(false)

// to show the time a message was sent
function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}
</script>
<template>
  <div id="messenger-container" v-if="route.params.id">
    <div class="messenger-header">
      <button class="add-btn" @click="showInviteModal = true" title="New group chat">Add +</button>
      <div class="header-center">
        <button class="group-name-btn" @click="showMembers = !showMembers">
          {{ groupName }} ▾
        </button>
        <div v-if="showMembers" class="member-dropdown">
          <span v-for="member in currentGroup?.members" :key="member.user_id" class="member-chip">
            {{ member.username }}
          </span>
        </div>
      </div>
      <button class="leave-btn" @click="showLeaveModal = true" :disabled="isOwner">Leave</button>
      <Teleport to="body">
        <div v-if="showInviteModal" class="modal-bg" @click.self="closeInviteModal">
          <div class="modal">
            <p class="modal-title">Invite to group</p>

            <input
              v-model="inviteSearch"
              placeholder="Search by username..."
              @input="onInviteSearch"
              autofocus
            />

            <p v-if="inviteError" class="invite-error">{{ inviteError }}</p>
            <p v-if="inviteLoading" class="hint">Searching...</p>

            <div class="search-results" v-if="inviteResults.length">
              <div
                v-for="user in inviteResults"
                :key="user._id"
                class="result-row"
                @click="inviteUser(user)"
              >
                <span class="result-name">{{ user.username }}</span>
                <span class="result-add">+</span>
              </div>
            </div>

            <p v-else-if="!inviteLoading && inviteSearch" class="hint">No users found</p>

            <div class="modal-actions">
              <button class="cancel-btn" @click="closeInviteModal">Close</button>
            </div>
          </div>
        </div>
        <div v-if="showLeaveModal" class="modal-bg" @click.self="showLeaveModal = false">
          <div class="modal">
            <p class="modal-title">Leave Group</p>
            <p class="hint">
              Are you sure you want to leave <strong style="color: white">{{ groupName }}</strong
              >?
            </p>
            <div class="modal-actions">
              <button class="cancel-btn" @click="showLeaveModal = false">Cancel</button>
              <button
                class="confirm-leave-btn"
                @click="
                  () => {
                    showLeaveModal = false
                    leaveGroup()
                  }
                "
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      </Teleport>
    </div>
    <!-- remegber to put group memebers here -->
    <div ref="chatContainer" class="chat-messages">
      <div v-for="msg in chatMessages" :key="msg.id" class="message-row">
        <div
          class="message-bubble"
          :class="{ 'own-message': msg.userId === currentUser._id }"
          @click="handleBubbleClick(msg)"
        >
          <div class="author" v-if="msg.userId !== currentUser._id">
            {{ msg.username }}
          </div>

          <div class="text">
            {{ msg.message }}
          </div>

          <div class="time">{{ formatTime(msg.date) }}</div>
        </div>
      </div>
      <div v-if="chatMessages.length === 0" class="no-messages">Start the conversation!</div>
    </div>

    <div id="message-input-container">
      <input
        ref="messageInput"
        v-model="newMessage"
        type="text"
        placeholder="Type your message..."
        @keyup.enter="sendMessage"
        autofocus
      />
      <button @click="sendMessage">Send</button>
    </div>
  </div>

  <div v-else>
    <span>Select a group to start chatting.</span>
  </div>
</template>

<style scoped>
.time {
  font-size: 0.65rem;
  opacity: 0.5;
  text-align: right;
  margin-top: 4px;
}
.confirm-leave-btn {
  padding: 7px 14px;
  border-radius: 999px;
  border: 0.5px solid rgba(255, 80, 80, 0.4);
  background: rgba(255, 80, 80, 0.12);
  color: rgba(255, 100, 100, 0.9);
  cursor: pointer;
  font-size: 12px;
  transition: background 0.15s;
}

.confirm-leave-btn:hover {
  background: rgba(255, 80, 80, 0.25);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
}
.header-center {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.group-name-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  width: auto !important;
  height: auto !important;
  background: transparent;
  padding: 4px 8px;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.member-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  background: #2d3441;
  border-radius: 10px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 150px;
  z-index: 50;
  border: 0.5px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.member-chip {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.75);
  padding: 5px 10px;
  border-radius: 6px;
  transition: background 0.15s;
}

.member-chip:hover {
  background: rgba(255, 255, 255, 0.08);
}

.leave-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  pointer-events: none;
}
.modal-bg {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: #2d3441;
  border-radius: 12px;
  padding: 20px;
  width: 260px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-title {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: white;
}

.modal input {
  font-size: 13px;
  padding: 8px 10px;
  border-radius: 8px;
  border: 0.5px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.07);
  color: white;
  outline: none;
  width: 100%;
  box-sizing: border-box;
}

.modal input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.search-results {
  max-height: 160px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.result-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.result-row:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
}

.result-name {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
}

.result-add {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.4);
}

.hint {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.35);
  text-align: center;
}

.invite-error {
  font-size: 12px;
  color: #dc6464;
  margin: 0;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
}

.cancel-btn {
  padding: 7px 14px;
  border-radius: 999px;
  border: 0.5px solid rgba(255, 255, 255, 0.15);
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  font-size: 12px;
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.07);
  transform: translateY(-2px);
}

.messenger-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.messenger-header button {
  width: 70px;
  height: 30px;
  border-radius: 8px;
  border: 0.5px solid rgba(255, 255, 255, 0.15);
  cursor: pointer;
  background-color: #222831;
  color: white;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  margin: 8px;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
}
.leave-btn:hover {
  transform: translateY(-2px);
  background-color: rgb(255, 0, 0);
  box-shadow: 0 10px 25px rgba(238, 2, 2, 0.25);
}

.add-btn:active {
  transform: translateY(0);
}
.leave-btn:active {
  transform: translateY(0);
}

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
  text-align: left;
}

.text {
  font-size: 0.9rem;
  line-height: 1.3;
  text-align: left;
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
