<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'
import SidebarNav from './SidebarNav.vue'

const userStore = useUserStore()
const router = useRouter()
let pollInterval = null

const search = ref('')
const error = ref('')
const loading = ref(false)

const currentUser = computed(() => userStore.currentUser)
const friendRequests = computed(() => userStore.friendRequests)
const friends = computed(() => userStore.friends)

onMounted(async () => {
  await userStore.getUser()
  await userStore.getFriendRequests()
  await userStore.getFriends()

  pollInterval = setInterval(async () => {
    ;(await userStore.getUser(), await userStore.getFriendRequests(), await userStore.getFriends())
  }, 3000)
})
onUnmounted(() => {
  if (pollInterval) {
    clearInterval(pollInterval)
  }
})

const requestSent = ref(false)

async function addFriend() {
  error.value = ''
  try {
    loading.value = true
    const results = await userStore.findUsers(search.value)
    const user = results.find((u) => u.username === search.value)

    if (!user) {
      error.value = '*Enter valid username'
      return
    }
    if (user._id === currentUser.value._id) {
      error.value = '*You cannot add yourself'
      return
    }
    const alreadyFriends = friends.value.some((f) => f.userId === user._id)
    if (alreadyFriends) {
      error.value = '*Already friends'
      return
    }
    const alreadySent = currentUser.value.requests?.some(
      (r) => r.receiver?.userId === user._id || r.receiver === user._id,
    )
    if (alreadySent) {
      error.value = '*Request already sent'
      return
    }

    await userStore.sendRequest(user._id)
    await userStore.getUser()
    search.value = ''
    requestSent.value = true
    setTimeout(() => (requestSent.value = false), 3000)
  } catch (err) {
    error.value = `*${err.message}`
  } finally {
    loading.value = false
  }
}

async function acceptRequest(requestId) {
  try {
    await userStore.requestDecision(requestId, true)
    await userStore.getFriendRequests()
    await userStore.getFriends()
  } catch (err) {
    console.error('Accept failed:', err)
  }
}

async function declineRequest(requestId) {
  try {
    await userStore.requestDecision(requestId, false)
    await userStore.getFriendRequests()
  } catch (err) {
    console.error('Decline failed:', err)
  }
}

async function removeFriend(friendId) {
  try {
    await userStore.removeFriends(friendId)
    await userStore.getFriends()
  } catch (err) {
    console.error(err)
  }
}
</script>

<template>
  <div class="side-bar">
    <SidebarNav />

    <div class="scroll-area">
      <section class="add-friend">
        <p class="section-label">Add friend</p>
        <div class="add-row">
          <input
            id="searchInput"
            v-model="search"
            placeholder="Username"
            @keyup.enter="addFriend"
          />
          <button class="add-btn" @click="addFriend" :disabled="loading">
            {{ loading ? '...' : 'Add' }}
          </button>
        </div>
        <span v-if="error" class="error-msg">{{ error }}</span>
        <span v-if="requestSent" class="success-msg">Request sent!</span>
      </section>

      <!-- Friends List -->
      <section class="friends">
        <p class="section-label">Friends</p>
        <p v-if="!friends.length" class="empty">No friends yet</p>
        <div v-else v-for="friend in friends" :key="friend.userId" class="friend-row">
          <div class="avatar">{{ friend.username.slice(0, 2).toUpperCase() }}</div>
          <span class="friend-name">{{ friend.username }}</span>
          <button class="remove-btn" @click="removeFriend(friend.userId)">Remove</button>
        </div>
      </section>

      <!-- Friend Requests -->
      <section class="section">
        <p class="section-label">
          Friend Requests
          <span v-if="friendRequests.length" class="badge">{{ friendRequests.length }}</span>
        </p>
        <p v-if="!friendRequests.length" class="empty">No requests</p>
        <div v-else v-for="request in friendRequests" :key="request._id" class="request-row">
          <span class="friend-name">{{ request.sender.username }}</span>
          <div class="request-actions">
            <button class="accept-btn" @click="acceptRequest(request._id)">Accept</button>
            <button class="decline-btn" @click="declineRequest(request._id)">Decline</button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.success-msg {
  font-size: 11px;
  color: green;
}
.add-friend {
  display: flex;
  flex-direction: column;
  gap: 6px;
  height: 350px;
}
.friends {
  display: flex;
  flex-direction: column;
  gap: 6px;
  height: 350px;
}
.side-bar {
  display: flex;
  flex-direction: column;
  height: 100%;
  color: white;
}

.scroll-area {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.section-label {
  margin: 0 0 4px;
  font-size: 11px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.35);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 6px;
}

.badge {
  background: rgba(255, 100, 100, 0.2);
  color: rgba(255, 120, 120, 0.9);
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 999px;
}

.add-row {
  display: flex;
  gap: 6px;
}

#searchInput {
  flex: 1;
  font-size: 13px;
  padding: 7px 10px;
  border-radius: 8px;
  border: 0.5px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.07);
  color: white;
  outline: none;
  min-width: 0;
}

#searchInput::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.add-btn {
  padding: 7px 12px;
  border-radius: 999px;
  border: 0.5px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.07);
  color: white;
  cursor: pointer;
  font-size: 12px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  white-space: nowrap;
}

.add-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
}

.add-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-msg {
  font-size: 11px;
  color: rgba(255, 100, 100, 0.85);
}

.friend-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 4px;
}

.avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 500;
  flex-shrink: 0;
  color: rgba(255, 255, 255, 0.7);
}

.friend-name {
  flex: 1;
  font-size: 13px;
  color: white;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.remove-btn {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 999px;
  border: 0.5px solid rgba(255, 100, 100, 0.4);
  background: transparent;
  color: rgba(255, 100, 100, 0.8);
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s;
}

.remove-btn:hover {
  background: rgba(255, 100, 100, 0.12);
}

.request-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 5px 4px;
}

.request-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.accept-btn {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 999px;
  border: 0.5px solid rgba(72, 199, 142, 0.5);
  background: rgba(72, 199, 142, 0.12);
  color: #48c78e;
  cursor: pointer;
  transition: background 0.15s;
}

.accept-btn:hover {
  background: rgba(72, 199, 142, 0.22);
}

.decline-btn {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 999px;
  border: 0.5px solid rgba(255, 255, 255, 0.15);
  background: transparent;
  color: rgba(255, 255, 255, 0.45);
  cursor: pointer;
  transition: background 0.15s;
}

.decline-btn:hover {
  background: rgba(255, 255, 255, 0.07);
}

.empty {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.35);
}
</style>
