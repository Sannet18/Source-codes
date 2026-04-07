import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Users from '@/modules/User'
import { getToken, removeToken, setToken } from '../../util/auth'

export const useUserStore = defineStore('userStore', () => {
  const users = ref(JSON.parse(localStorage.getItem('users')) || [...Users])

  const currentUser = ref(JSON.parse(localStorage.getItem('currentUser')) || null)
  if (currentUser.value?.authToken) {
    setToken(currentUser.value.authToken)
  }
  const friendChat = ref(null)

  const selectedFriend = computed(() => users.value.find((u) => u.id === friendChat.value))
  const loggedIn = computed(() => !!currentUser.value)
  const friendRequests = ref([])

  const URL = 'https://stingray-app-u3bsh.ondigitalocean.app'

  console.log(getToken())
  async function login(username, password) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    }

    try {
      const res = await fetch(`${URL}/user/login`, options)

      if (!res.ok) {
        throw new Error('Invalid username or password')
      }

      const user = await res.json()

      console.log('User from server:', user)
      console.log('Token from server:', user.token)

      setToken(user.authToken)

      currentUser.value = user
      localStorage.setItem('currentUser', JSON.stringify(user))

      console.log('Token after login:', getToken())

      return user
    } catch (err) {
      throw err
    }
  }

  async function createUser(firstName, lastName, username, email, password) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName,
        lastName,
        username,
        email,
        password,
      }),
    }

    try {
      const res = await fetch(`${URL}/user`, options)

      console.log(`Res status : ${res.status}`)

      if (!res.ok) {
        if (res.status === 409) {
          throw new Error('User already Exists')
        }

        const text = await res.text()
        const result = text ? JSON.parse(text) : null
        throw new Error(result?.message || 'Something went wrong')
      }

      const text = await res.text()
      const result = text ? JSON.parse(text) : null

      return result
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
      if (!res.ok) {
        throw new Error('Failed to fetch user')
      }

      const user = await res.json()
      currentUser.value = user
      return user
    } catch (err) {
      throw err
    }
  }

  // got this online
  const userMap = ref({})
  async function getUserById(id) {
    if (userMap.value[id]) return userMap.value[id]

    const res = await fetch(`${URL}/user/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    })

    if (!res.ok) throw new Error('Failed to fetch user')

    const user = await res.json()
    userMap.value[id] = user

    return user
  }

  async function sendRequest(userId) {
    const token = getToken()

    if (!token) {
      throw new Error('Not authenticated. Please log in first.')
    }
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    }
    try {
      const res = await fetch(`${URL}/friend-request/${userId}`, options)

      if (!res.ok) {
        throw new Error('Failed to send friend request')
      }
      return await res.json()
    } catch (err) {
      throw err
    }
  }

  async function requestDecision(requestId, accept) {
    const token = getToken()

    if (!token) {
      throw new Error('Not authenticated. Please log in first.')
    }
    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    }
    try {
      const res = await fetch(`${URL}/friend-request/${requestId}?accept=${accept}`, options)

      if (!res.ok) {
        throw new Error('Failed to accept/deny request')
      }
      return await res.json()
    } catch (err) {
      throw err
    }
  }

  async function getFriendRequests() {
    const token = getToken()

    if (!token) {
      throw new Error('Not authenticated. Please log in first.')
    }
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    }

    try {
      const res = await fetch(`${URL}/friend-requests`, options)

      if (!res.ok) {
        throw new Error('Failed to fetch friends')
      }

      if (res.status === 401) {
        throw new Error('Unauthorized: Please log in again')
      }

      const friends = await res.json()
      friendRequests.value = friends

      // got this online
      for (const req of friends) {
        await getUserById(req.sender_id)
        await getUserById(req.receiver_id)
      }

      return friends
    } catch (err) {
      throw err
    }
  }
  async function removeFriends(userId) {
    const token = getToken()

    if (!token) {
      throw new Error('Not authenticated. Please log in first.')
    }
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    }
    try {
      const res = await fetch(`${URL}/friend/${userId}`, options)

      if (!res.ok) {
        throw new Error('Failed to remove friend')
      }
    } catch (err) {
      throw err
    }
  }
  function selectFriend(friendId) {
    friendChat.value = friendId
  }

  function logout() {
    currentUser.value = null
    removeToken()
    localStorage.removeItem('currentUser')
  }

  
  // got this online
  function findUserIdByUsername(username) {
    for (const userId in userMap.value) {
      if (userMap.value[userId].username === username) {
        return Number(userId)
      }
    }
    return null
  }

  return {
    findUserIdByUsername,
    users,
    currentUser,
    selectedFriend,
    loggedIn,
    removeFriends,
    login,
    getUser,
    sendRequest,
    userMap,
    getUserById,
    requestDecision,
    getFriendRequests,
    createUser,
    logout,
    selectFriend,
  }
})
