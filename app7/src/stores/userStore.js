import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Users from '@/modules/User'

export const useUserStore = defineStore('userStore', () => {
  const users = ref(JSON.parse(localStorage.getItem('users')) || [...Users])

  const currentUserId = ref(JSON.parse(localStorage.getItem('currentUserId')) || null)
  const friendChat = ref(null)

  const currentUser = computed(() => users.value.find((u) => u.id === currentUserId.value))
  const selectedFriend = computed(() => users.value.find((u) => u.id === friendChat.value))
  const loggedIn = computed(() => currentUser.value)

  function login(username, password) {
    const user = users.value.find((u) => u.username === username && u.password === password)

    if (!user) throw new Error('Invalid credentials')

    currentUserId.value = user.id
    localStorage.setItem('currentUserId', JSON.stringify(user.id))
  }

  function createUser(username, password) {
    const existingUser = users.value.find((u) => u.username === username)
    if (existingUser) {
      throw new Error('Username already exists')
    }
    const newUser = {
      id: Date.now(),
      username,
      password,
      friends: [],
      friendRequests: [],
      outgoingRequests: [],
    }

    users.value.push(newUser)
    localStorage.setItem('users', JSON.stringify(users.value))
    login(username, password)
  }

  function selectFriend(friendId) {
    friendChat.value = friendId
  }
  function logout() {
    currentUserId.value = null
    localStorage.removeItem('currentUserId')
  }

  return {
    users,
    currentUser,
    selectedFriend,
    loggedIn,
    login,
    createUser,
    logout,
    selectFriend,
  }
})
