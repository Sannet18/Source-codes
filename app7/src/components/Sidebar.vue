<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const userStore = useUserStore()
const router = useRouter()

const search = ref('')
const error = ref('')

const currentUser = computed(() => userStore.currentUser)

const requests = computed(() => userStore.friendRequests || [])

const friends = computed(() => currentUser.value?.friends || [])

const incomingRequests = computed(() =>
  (requests.value || []).filter(
    (req) => req.receiver_id === currentUser.value?.id && req.status === 'pending',
  ),
)

const outgoingRequests = computed(() =>
  (requests.value || []).filter(
    (req) => req.sender_id === currentUser.value?.id && req.status === 'pending',
  ),
)
function getUsername(id) {
  return userStore.userMap[id]?.username || 'Loading...'
}

async function addFriend() {
  console.log('Current user:', userStore.currentUser)
  console.log('Current user username:', userStore.currentUser?.username)
  error.value = ''

  if (!search.value.trim()) {
    error.value = '*Please enter a username'
    return
  }

  if (search.value === currentUser.value?.user.username) {
    error.value = '*You cannot add yourself'
    return
  }

  try {
    const targetUserId = userStore.findUserIdByUsername(search.value)

    if (!targetUserId) {
      error.value = '*Enter valid username'
      return
    }

    await userStore.sendRequest(targetUserId)
    search.value = ''
    await userStore.getFriendRequests()
  } catch (err) {
    error.value = err.message
  }
}

async function acceptRequest(requestId) {
  await userStore.requestDecision(requestId, true)
  await userStore.getFriendRequests()
}

async function declineRequest(requestId) {
  await userStore.requestDecision(requestId, false)
  await userStore.getFriendRequests()
}
function chat(friendId) {
  const friend = userStore.users.find((user) => user.id === friendId)
  if (!friend) return

  router.push(`/home/chat/${friend.username}`)
}

onMounted(async () => {
  try {
    await userStore.getFriendRequests()
  } catch (err) {
    console.error('Failed to fetch friend requests:', err)
    error.value = err.message
  }
})
</script>

<template>
  <div class="side-bar">
    <fieldset>
      <div class="add-friend">
        <h3>Add Friend</h3>
      </div>

      <input id="searchInput" v-model="search" placeholder="Enter Username" />

      <span v-if="error" style="color: red" id="error-msg">
        {{ error }}
      </span>

      <br />
      <button @click="addFriend">Add friend</button>
    </fieldset>
    <div class="friends-list">
      <fieldset>
        <h3>Friends</h3>

        <div v-if="friends.length === 0">No friends yet</div>

        <div v-else>
          <div v-for="friendId in friends" :key="friendId">
            <button @click="chat(friendId)" class="friend">
              {{ getUsername(friendId) }}
            </button>
          </div>
        </div>
      </fieldset>
    </div>

    <div class="friend-requests">
      <fieldset>
        <h3>Friend Requests</h3>

        <div v-if="incomingRequests.length === 0">No friend requests</div>

        <div v-else>
          <div v-for="req in incomingRequests" :key="req.id">
            {{ getUsername(req.sender_id) }} :
            <button @click="acceptRequest(req.id)">Accept</button>
            <button @click="declineRequest(req.id)">Decline</button>
          </div>
        </div>
      </fieldset>
    </div>

    <div class="outgoing-requests">
      <fieldset>
        <h3>Sent Requests</h3>

        <div v-if="outgoingRequests.length === 0">No outgoing requests</div>

        <div v-else>
          <div v-for="req in outgoingRequests" :key="req.id">
            {{ getUsername(req.receiver_id) }} <span>(Pending)</span>
          </div>
        </div>
      </fieldset>
    </div>
  </div>
</template>

<style scoped>
#searchInput {
  flex: 1;
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

#error-msg {
  font-size: 0.78rem;
  margin-bottom: 6px;
}

.friend-requests button {
  width: 65px;
  height: 30px;
  margin-left: 4px;
}

button {
  width: 100px;
  height: 35px;
  border-radius: 999px;
  border: none;
  padding: 10px;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  background-color: #f2f2f2;
  margin-bottom: 8px;
}

.friend:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
}

.friend:active {
  transform: translateY(0);
}

fieldset {
  border-radius: 10px;
}

.friends-list,
.friend-requests,
.outgoing-requests,
.add-friend {
  overflow-y: auto;
  text-align: center;
}

.side-bar {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
