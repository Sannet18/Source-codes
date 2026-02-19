<script setup>
import { useMessageStore } from './stores/messageStore.js'
import Login from './components/Login.vue'
import Messenger from './components/Messenger.vue'

const messageStore = useMessageStore()
</script>

<template>
  <div id="app">
    <Login v-if="!messageStore.selectedUser" />
    <Messenger v-else />
  </div>
</template>

<style scoped>
#app {
  width: 100%;
  height: 100%;
}
</style>
