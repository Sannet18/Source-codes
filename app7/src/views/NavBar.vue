<!-- <script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()

const showConfirm = ref(false)
const showProfile = ref(false)

const currentUser = computed(() => userStore.currentUser)

const toggleProfile = async () => {
  await userStore.fetchUser()
  showProfile.value = !showProfile.value
}

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
    <div class="left">
      <button v-if="userStore.loggedIn" @click="toggleProfile" class="opt">
        {{ currentUser?.user.username }}
      </button>
    </div>

    <div class="right">
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
    <div v-if="showProfile" class="confirm-overlay">
      <div class="confirm-box">
        <h3>User Info</h3>

        <p><strong>Username:</strong> {{ currentUser?.username }}</p>
        <p><strong>ID:</strong> {{ currentUser?.id }}</p>
        <p><strong>Friends:</strong> {{ currentUser?.friends.length }}</p>

        <div class="confirm-buttons">
          <button class="opt" @click="showProfile = false">Close</button>
        </div>
      </div>
    </div>
    <div v-if="showConfirm" class="confirm-overlay">
      <div class="confirm-box">
        <p>Do you really want to sign out?</p>
        <div class="confirm-buttons">
          <button class="opt" @click="signOut">Confirm</button>
          <button class="opt" @click="cancelSignOut">Cancel</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
nav {
  background-color: #dcdcdc;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.left {
  display: flex;
}

.right {
  display: flex;
  gap: 20px;
}
button {
  width: 100px;
  height: 40px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  background-color: #222831;
  color: white;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.opt:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
}

.opt:active {
  transform: translateY(0);
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
</style> -->

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()
const userStore = useUserStore()
const showConfirm = ref(false)

const currentUser = computed(() => userStore.currentUser)

const goToProfile = () => {
  router.push('/profile')
}

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
    <div class="left">
      <button v-if="userStore.loggedIn" @click="goToProfile" class="opt">
        {{ currentUser?.user.username }}
      </button>
    </div>

    <div class="right">
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
          <button class="opt" @click="signOut">Confirm</button>
          <button class="opt" @click="cancelSignOut">Cancel</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* Keep all your existing styles */
nav {
  background-color: #dcdcdc;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.left {
  display: flex;
}

.right {
  display: flex;
  gap: 20px;
}
button {
  width: 100px;
  height: 40px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  background-color: #222831;
  color: white;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.opt:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
}

.opt:active {
  transform: translateY(0);
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
