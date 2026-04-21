<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const tabs = [
  { label: 'Chats', to: '/home' },
  { label: 'Friends', to: '/home/friends' },
]

function navigate(path) {
  router.push(path)
}

function isActive(path) {
  if (path === '/home')
    return (
      route.path === '/home' ||
      route.path.startsWith('/home/group') ||
      route.path.startsWith('/home/chat')
    )
  return route.path.startsWith(path)
}
</script>

<template>
  <div class="tab-bar">
    <button
      v-for="tab in tabs"
      :key="tab.to"
      class="tab"
      :class="{ active: isActive(tab.to) }"
      @click="navigate(tab.to)"
    >
      {{ tab.label }}
    </button>
    <div class="indicator" :style="{ left: isActive('/home/friends') ? '50%' : '0%' }" />
  </div>
</template>

<style scoped>
.tab-bar {
  display: flex;
  position: relative;
  border-bottom: 0.5px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.tab {
  flex: 1;
  padding: 12px 8px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.45);
  cursor: pointer;
  font-size: 13px;
  font-weight: 400;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.tab:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
}
.tab.active {
  color: white;
  font-weight: 500;
  transform: translateY(0);
}

.indicator {
  position: absolute;
  bottom: 0;
  width: 50%;
  height: 2px;
  background: white;
  border-radius: 2px 2px 0 0;
  transition: left 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
