import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Users from '@/modules/User'

export const useUserStore = defineStore('userStore', () => {
  const users = ref(JSON.parse(localStorage.getItem('users')) || [...Users])

  const currentUser = ref(JSON.parse(localStorage.getItem('currentUser')) || null)

  const friendChat = ref(null)

  const selectedFriend = computed(() => users.value.find((u) => u.id === friendChat.value))
  const loggedIn = computed(() => !!currentUser.value)

  const URL = 'https://stingray-app-u3bsh.ondigitalocean.app'

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

  function selectFriend(friendId) {
    friendChat.value = friendId
  }

  function logout() {
    currentUser.value = null
    localStorage.removeItem('currentUser')
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
