<script setup>
// Wednesday
// Dont forget about these onees 
// Display active friends
// Display friend requests where I have accept and decline buttons next to them(check for not a user, adding yourself, if request has already been sent
// Check if username exists before friend requests can be sent

import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/userStore'

import { useRoute, useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()


const search = ref('')
const error = ref('')


const currentUser = computed(() => userStore.currentUser)

const friends = computed(() => currentUser.value?.friends || [])


const requests = computed(() => currentUser.value?.friendRequests || [])

function addFriend() {
  error.value = ''

  const user = userStore.users.find((u) => u.username === search.value)

  if (!user) {
    error.value = '*Enter valid username'
    return
  }

  if (user.id === currentUser.value.id) {
    error.value = '*You cannot add yourself'
    return
  }

  if (currentUser.value.friends.includes(user.id)) {
    error.value = '*Already friends'
    return
  }

  if (currentUser.value.outgoingRequests.includes(user.id)) {
    error.value = '*Request already sent'
    return
  }

  currentUser.value.outgoingRequests.push(user.id)
  user.friendRequests.push(currentUser.value.id)

  localStorage.setItem('users', JSON.stringify(userStore.users))

  search.value = ''
}

function acceptRequest(friendId) {
  const friend = userStore.users.find((u) => u.id === friendId)


  currentUser.value.friends.push(friendId)
  friend.friends.push(currentUser.value.id)

  currentUser.value.friendRequests = currentUser.value.friendRequests.filter(
    (id) => id !== friendId,
  )

  friend.outgoingRequests = friend.outgoingRequests.filter((id) => id !== currentUser.value.id)

  localStorage.setItem('users', JSON.stringify(userStore.users))
}


function declineRequest(friendId) {
  const friend = userStore.users.find((u) => u.id === friendId)

  currentUser.value.friendRequests = currentUser.value.friendRequests.filter(
    (id) => id !== friendId,
  )

  friend.outgoingRequests = friend.outgoingRequests.filter((id) => id !== currentUser.value.id)

  localStorage.setItem('users', JSON.stringify(userStore.users))
}

console.log(currentUser.value)

function chat(friendId) {
  const friend = userStore.users.find((user) => user.id === friendId)
  if (!friend) return

  router.push(`/home/chat/${friend.username}`)
}
</script>

<template>
  <div class="side-bar">
    <!-- don't forget the v-for should for this side(friends)-->
    <div class="friends-list">
      <fieldset>
        <h3>Friends</h3>
        <div v-for="friendId in friends" :key="friendId">
          <button @click="chat(friendId)" class="friend">
            {{ userStore.users.find((user) => user.id === friendId)?.username }}
          </button>
        </div>
      </fieldset>
    </div>
    <div class="friend-requests">
      <!-- A v-for should go here to list requests -->
      <fieldset>
        <h3>Friend Requests</h3>
        <div v-for="friendId in requests" :key="friendId">
          {{ userStore.users.find((user) => user.id === friendId)?.username }} :
          <button @click="acceptRequest(friendId)">Accept</button
          ><button @click="declineRequest(friendId)">Decline</button>
        </div>
      </fieldset>
    </div>
    <fieldset>
      <div class="add-friend"><h3>Add Friend</h3></div>
      <label for="search" class="search"></label>
      <!-- Add v-model for the input field -->
      <!-- Add condition to check if username exists to send request -->
      <input id="searchInput" v-model="search" placeholder="Enter Username" />
      <span v-if="error" style="color: red" id="error-msg"> {{ error }}</span
      <br />
      <button @click="addFriend">Add friend</button>
    </fieldset>
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
  text-align: center;
  justify-content: center;
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
  display: inline-block;
}
.friend:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
}

.friend:active {
  transform: translateY(0);
}
fieldset {
  -webkit-border-radius: 10px;
}
.friends-list,
.friend-requests,
.add-friend {
  overflow: hidden;
  overflow-y: auto;
  text-align: center;
}
.side-bar {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: space-between;
}
</style>
