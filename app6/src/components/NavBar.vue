<script setup>
import { useUserStore } from '@/stores/userStore'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const userStore = useUserStore()
const route = useRoute()

const userLog = computed(() => userStore.loggedIn)
const onLoginPage = computed(() => route.name === 'login')
const onAboutPage = computed(() => route.name === 'about')
</script>

<template>
  <nav>
    <div>
      <!-- Gotta condition these -->
      <RouterLink to="/home" :class="userLog && !onLoginPage ? 'link' : 'hidden link'">
        Home
      </RouterLink>
    </div>

    <div>
      <RouterLink to="/login" :class="!userLog && onAboutPage ? 'link' : 'hidden link'">
        Log in
      </RouterLink>

      <RouterLink to="/login" :class="userLog && !onLoginPage ? 'link' : 'hidden link'">
        <span>Log out</span>
      </RouterLink>
    </div>
  </nav>
</template>
<style scoped>
.router-link-active {
  background-color: gray;
  color: #fff;
  transition:
    background-color 0.25s ease-in,
    color 0s ease-in 0.25s;
}
.hidden {
  visibility: hidden;
}
.link {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 999px;
  color: #000;
}
nav {
  background-color: #dcdcdc;
  padding: 10px;
  display: flex;
  justify-content: space-between;
}
</style>
