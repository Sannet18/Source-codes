<script setup>
import { useUserStore } from '@/stores/userStore'
const userStore = useUserStore()
</script>

<template>
  <div class="home-view view">
    <h1>Welcome {{ userStore.username }}</h1>
    <div class="ee hidden">
      <div class="six">6</div>
      <div class="seven">7</div>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  box-sizing: border-box;
  padding: 20px;
  background-color: #efeded;
  opacity: 97%;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.ee {
  display: flex;
  gap: 20px;
  font-size: 10rem;
  font-weight: 700;
  font-family:
    Arial Black,
    sans-serif;
  align-self: center;
}

.six,
.seven {
  display: inline-block;
  animation: hand-pump-36ce39c4 0.4s infinite cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.seven {
  animation-delay: 0.1s;
  color: #ff4757;
}

@keyframes hand-pump-36ce39c4 {
  0%,
  to {
    transform: translateY(0) rotate(0);
  }

  30% {
    transform: translateY(-40px) rotate(-10deg) scale(1.1);
  }

  70% {
    transform: translateY(10px) rotate(5deg) scale(0.9);
  }
}

.hidden {
  visibility: hidden;
}

.view {
  position: relative;
}
.view:after {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  content: '';
  background-image: url(/starfish.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  filter: grayscale(100%);
  opacity: 0.05;
  z-index: -1;
}
</style>
