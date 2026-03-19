<script setup>
import NavBar from './NavBar.vue'
import { defineProps } from 'vue'

const props = defineProps({
  imageUrl: String,
})
console.log(props.imageUrl)
</script>

<template>
  <NavBar />
  <div>
    <img :src="imageUrl" alt="Message-icon" />
  </div>
</template>

<style scoped>
div {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  padding: 50px;
}

img {
  width: 100px;
  height: 100px;
}
</style>
