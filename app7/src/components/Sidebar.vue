<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

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
})

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
    console.log('requests:', currentUser.value.requests)
    console.log('alreadySent:', alreadySent)
    console.log('user._id:', user._id)
    if (alreadySent) {
      error.value = '*Request already sent'
      return
    }

    await userStore.sendRequest(user._id)
    await userStore.getUser()
    search.value = ''
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

function chat(friend) {
  router.push(`/home/chat/${friend.username}`)
}
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
      <button @click="addFriend" :disabled="loading">
        {{ loading ? 'Sending...' : 'Add friend' }}
      </button>
    </fieldset>

    <div class="friends-list">
      <fieldset>
        <h3>Friends</h3>

        <div v-if="!friends.length">No friends yet</div>

        <div v-else>
          <div v-for="friend in friends" :key="friend.userId" class="friend-item">
            <button @click="chat(friend)" class="friend">
              {{ friend.username }}
            </button>
            <button @click="removeFriend(friend.userId)" class="remove-btn">Remove</button>
          </div>
        </div>
      </fieldset>
    </div>

    <div class="friend-requests">
      <fieldset>
        <h3>Friend Requests</h3>

        <div v-if="friendRequests.length === 0">No friend requests</div>

        <div v-else>
          <div v-for="request in friendRequests" :key="request._id">
            {{ request.sender.username }} :
            <button @click="acceptRequest(request._id)">Accept</button>
            <button @click="declineRequest(request._id)">Decline</button>
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

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.friend:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
}

.friend:active {
  transform: translateY(0);
}

.friend-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.remove-btn {
  background-color: #ffe0e0;
  width: 70px;
  height: 30px;
}

.remove-btn:hover {
  background-color: red;
}

fieldset {
  border-radius: 10px;
}

.friends-list,
.friend-requests,
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
