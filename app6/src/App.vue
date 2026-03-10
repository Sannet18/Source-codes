<script setup>
import Footer from './components/Footer.vue'
import NavBar from './components/NavBar.vue'
</script>

<template>
  <div id="root">
    <NavBar />
    <RouterView></RouterView>
    <Footer />
  </div>
</template>

<style scoped>
#root {
  height: 100vh;
  width: 100vw;
  box-sizing: border-box;
  padding: 20px;
  display: flex;
  flex-direction: column;
}
</style>
