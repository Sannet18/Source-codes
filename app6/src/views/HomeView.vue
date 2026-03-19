<script setup>
import { useUserStore } from '@/stores/userStore'
const userStore = useUserStore()
</script>

<template>
  <RouterView class="side-box"></RouterView>
  <RouterView class="main-view"></RouterView>
</template>

<style scoped>
.home-view {
  box-sizing: border-box;
  padding: 20px;
  background-color: #efeded;
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>
