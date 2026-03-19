<script setup>
import NavBar from './views/NavBar.vue'
import StartView from './views/StartView.vue'
</script>

<template>
  <div id="root"><RouterView></RouterView></div>
</template>

<style scoped>
#root {
  height: 100vh;
  width: 100vw;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
</style>
