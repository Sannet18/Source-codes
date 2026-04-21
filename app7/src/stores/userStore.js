import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getToken, removeToken, setToken } from '../../util/auth'

export const useUserStore = defineStore('userStore', () => {
  const currentUser = ref(JSON.parse(localStorage.getItem('currentUser')) || null)
  const friendRequests = ref([])
  const friends = ref([])

  const loggedIn = computed(() => !!currentUser.value)

  const URL = 'https://stingray-app-u3bsh.ondigitalocean.app'

  async function login(username, password) {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    }

    try {
      const res = await fetch(`${URL}/user/login`, options)
      if (!res.ok) throw new Error('Invalid username or password')

      const user = await res.json()
      setToken(user.authToken)
      currentUser.value = user
      localStorage.setItem('currentUser', JSON.stringify(user))
      return user
    } catch (err) {
      throw err
    }
  }

  async function createUser(firstName, lastName, username, email, password) {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, username, email, password }),
    }

    try {
      const res = await fetch(`${URL}/user`, options)
      if (!res.ok) {
        if (res.status === 409) throw new Error('User already exists')
        const text = await res.text()
        const result = text ? JSON.parse(text) : null
        throw new Error(result?.message || 'Something went wrong')
      }

      const text = await res.text()
      return text ? JSON.parse(text) : null
    } catch (err) {
      throw err
    }
  }

  async function getUser() {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    }

    try {
      const res = await fetch(`${URL}/user`, options)
      if (!res.ok) throw new Error('Failed to fetch user')

      const user = await res.json()
      console.log('getUser response:', user)
      currentUser.value = user
      localStorage.setItem('currentUser', JSON.stringify(user))
      return user
    } catch (err) {
      throw err
    }
  }

  async function findUsers(username) {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    }

    try {
      const res = await fetch(`${URL}/users?search=${username}`, options)
      if (!res.ok) throw new Error('Failed to search users')

      const data = await res.json()
      return data.users
    } catch (err) {
      throw err
    }
  }

  async function sendRequest(userId) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    }

    try {
      const res = await fetch(`${URL}/friend-request/${userId}`, options)
      if (!res.ok) throw new Error('Failed to send friend request')

      const text = await res.text()
      return text ? JSON.parse(text) : null
    } catch (err) {
      throw err
    }
  }

  async function requestDecision(requestId, accept) {
    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    }

    try {
      const res = await fetch(`${URL}/friend-request/${requestId}?accept=${accept}`, options)
      if (!res.ok) throw new Error('Failed to accept/deny request')

      const text = await res.text()
      return text ? JSON.parse(text) : null
    } catch (err) {
      throw err
    }
  }
  async function getFriendRequests() {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    }

    try {
      const res = await fetch(`${URL}/friend-requests`, options)
      if (!res.ok) throw new Error('Failed to fetch friend requests')

      const requests = await res.json()
      friendRequests.value = requests
      return friendRequests.value
    } catch (err) {
      throw err
    }
  }

  async function getFriends() {
    try {
      const user = await getUser()
      friends.value = user.friends || []
      return friends.value
    } catch (err) {
      throw err
    }
  }

  async function removeFriends(userId) {
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    }

    try {
      const res = await fetch(`${URL}/friend/${userId}`, options)
      if (!res.ok) throw new Error('Failed to remove friend')
    } catch (err) {
      throw err
    }
  }

  async function logout() {
    const options = {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
    }

    try {
      const res = await fetch(`${URL}/user/logout`, options)

      if (!res.ok) {
        throw new Error('Logout failed, Try again')
      }

      // const data = await res.json()
    } catch (err) {
      throw err
    } finally {
      // Saw this practice online
      currentUser.value = null
      removeToken()
      localStorage.removeItem('currentUser')
    }
  }

  function getFriendByUsername(username) {
    return friends.value.find((f) => f.username === username)
  }

  return {
    currentUser,
    loggedIn,
    friends,
    friendRequests,
    login,
    createUser,
    getFriendByUsername,
    getUser,
    findUsers,
    sendRequest,
    requestDecision,
    getFriendRequests,
    getFriends,
    removeFriends,
    logout,
  }
})
