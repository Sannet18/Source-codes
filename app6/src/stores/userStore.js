import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('userStore', () => {
  const username = ref('')
  const password = ref('')
  const loggedIn = ref(true)

  function setUser(userName, passWord) {
    username.value = userName
    password.value = passWord
    loggedIn.value = true
  }
  function logout() {
    username.value = ''
    password.value = ''
    loggedIn.value = false
  }

  return { username, password, setUser, logout, loggedIn }
})
