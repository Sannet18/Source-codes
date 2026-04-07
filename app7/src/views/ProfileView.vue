<script setup>
import Profile from '@/components/Profile.vue'
import NavBar from './NavBar.vue';
</script>

<template>
  <div class="profile-page">
    <NavBar />
    <div class="profile-content">
      <Profile />
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.profile-content {
  flex: 1;
  overflow-y: auto;
}
</style>
