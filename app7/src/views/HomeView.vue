<script setup>
import { useUserStore } from '@/stores/userStore'
import NavBar from './NavBar.vue'
const userStore = useUserStore()

console.log(userStore.users)
</script>

<template>
  <!-- Create conditions to show Sign out on the Nav bar since the user will be signed in at this time. -->
  <NavBar />
  <div class="home-view">
    <RouterView class="sidebar" name="sidebar"></RouterView>
    <RouterView class="main" name="main"></RouterView>
  </div>
</template>

<style scoped>

.home-view {
  display: flex;
  height: calc(100vh - 60px);
  padding: 20px;
  gap: 30px;
  overflow: hidden;
  box-sizing: border-box;
  background-color: #efeded;
}

.sidebar {
  flex: 0 0 200px;
  background-color: #222831;
  overflow-y: auto;
  color: white;
  border-radius: 15px;
}

.main {
  flex: 1;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  background-color: white;
  height: 100%;
  text-align: center;
  overflow: hidden;
}
</style>
