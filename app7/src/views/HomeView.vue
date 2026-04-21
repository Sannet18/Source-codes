<!-- <script setup>
import { useUserStore } from '@/stores/userStore'
import NavBar from './NavBar.vue'
const userStore = useUserStore()

console.log(userStore.users)
</script>

<template>
  <NavBar :username= userStore.username " />
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
</style> -->

<script setup>
import { useUserStore } from '@/stores/userStore'
import NavBar from './NavBar.vue'

const userStore = useUserStore()
</script>

<template>
  <NavBar :username="userStore.username" />
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
  color: white;
  border-radius: 15px;
  min-width: 260px;
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
