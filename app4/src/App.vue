<script setup>
import checkMark from './assets/Check-Mark.png'
import { ref, provide } from 'vue'
import Form from './view/Form.vue'


const formData = ref({
  title: '',
  author: '',
  type: '',
  date: '',
  description: '',
})
//trying provide and inject
provide('checkMark', checkMark)
</script>

<template>
  <div id="root">
    <Form v-model="formData" />
  </div>
</template>

<style scoped>
.root {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
