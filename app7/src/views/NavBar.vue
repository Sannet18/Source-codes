<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'
import { defineProps } from 'vue'

const router = useRouter()
const userStore = useUserStore()

const showConfirm = ref(false)

const confirmSignOut = () => {
  showConfirm.value = true
}

const signOut = () => {
  userStore.logout()
  router.push('/')
  showConfirm.value = false
}

const cancelSignOut = () => {
  showConfirm.value = false
}


</script>

<template>
  <nav>
    <div>
      <!-- Don't forget to add the vif statements here to display the things -->
      <template v-if="!userStore.loggedIn">
        <RouterLink to="/createAccount">
          <button class="opt" style="font-size: 12px">Create Account</button>
        </RouterLink>

        <RouterLink to="/signIn">
          <button class="opt">Sign in</button>
        </RouterLink>
      </template>

      <template v-else>
        <button @click="confirmSignOut" class="opt">Sign Out</button>
      </template>
    </div>

    <div v-if="showConfirm" class="confirm-overlay">
      <div class="confirm-box">
        <p>Do you really want to sign out?</p>
        <div class="confirm-buttons">
          <button class="opt" @click="signOut">Confrim</button>
          <button class="opt" @click="cancelSignOut">Cancel</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
button {
  text-align: center;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 40px;
  border-radius: 999px;
  border: none;
  padding: 10px;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  background-color: #222831;
  color: white;
}

.opt:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
}

.opt:active {
  transform: translateY(0);
}

nav {
  background-color: #dcdcdc;
  padding: 10px;
}

nav div {
  display: flex;
  gap: 20px;
  justify-content: flex-end;
}

.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.confirm-box {
  background-color: #f8f8f8;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  min-width: 250px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.confirm-buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 15px;
}

.confirm-buttons .opt {
  width: 80px;
  height: 35px;
  font-size: 12px;
}
</style>
