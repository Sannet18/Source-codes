<script setup>
import Buttons from './components/Buttons.vue'
import Layout from './components/Layout.vue'

</script>

<template>
  <div class="root">
    <Layout>
    </Layout>
  </div>
</template>

<style scoped>
.root {
  margin: 10px;
  height: 100vh;
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}


</style>
