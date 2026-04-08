<script setup>
import { computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
const currentUser = computed(() => userStore.currentUser)

onMounted(async () => {
  try {
    await userStore.getUser()
  } catch (err) {
    console.error('Failed to fetch user:', err)
  }
})
</script>

<template>
  <div class="profile-container">
    <div class="profile-box">
      <h2>User Profile</h2>

      <div class="profile-info">
        <div class="info-item">
          <strong>Username:</strong>
          <p>{{ currentUser?.username }}</p>
        </div>

        <div class="info-item">
          <strong>Email:</strong>
          <p>{{ currentUser?.email }}</p>
        </div>

        <div class="info-item">
          <strong>First Name:</strong>
          <p>{{ currentUser?.firstName }}</p>
        </div>

        <div class="info-item">
          <strong>Last Name:</strong>
          <p>{{ currentUser?.lastName }}</p>
        </div>

        <div class="info-item">
          <strong>Friends:</strong>
          <p>{{ currentUser?.friends?.length || 0 }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.profile-box {
  background-color: #f8f8f8;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-width: 400px;
}

.profile-box h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #222831;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  background-color: white;
  border-radius: 8px;
  border-left: 4px solid #222831;
}

.info-item strong {
  color: #222831;
  min-width: 120px;
}

.info-item p {
  margin: 0;
  color: #666;
  text-align: right;
}
</style>
