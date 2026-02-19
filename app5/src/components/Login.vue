<script setup>
import { useMessageStore } from '../stores/messageStore.js'

const messageStore = useMessageStore()

function selectUser(user) {
  messageStore.setUser(user)
}
</script>

<template>
  <div id="login-root">
    <div id="login-container">
      <header>Login Page</header>
      <br />
      <div id="buttons-container">
        <br />
        <button
          v-for="user in messageStore.users"
          :key="user.username"
          class="user"
          :class="{ selected: messageStore.selectedUser?.username === user.username }"
          @click="selectUser(user)"
        >
          {{ user.firstName }}
        </button>
      </div>
      <span>Select a User</span>
    </div>
  </div>
</template>

<style scoped>
header {
  font-weight: bold;
  font-size: 2rem;
}
#login-root {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(90deg, red, green);
  justify-content: center;
  display: flex;
  flex-direction: column;
}
#login-container {
  width: 500px;
  padding: 40px;
  height: 500px;
  position: relative;
  align-items: center;
  color: #f8f9ff;
  justify-content: center;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.12);
  margin: auto;
  gap: 8px;
  border: 1px solid;
  border-radius: 18px;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
}
button {
  width: 80px;
  height: 40px;
  border-radius: 999px;
  border: none;
  padding: 10px;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.user:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
}

.user:active {
  transform: translateY(0);
}

.user.selected {
  background-color: #4ade80;
  font-weight: bold;
}
</style>
