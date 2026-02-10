<script setup>
const props = defineProps({
  src: String,
})
</script>

<template>
  <img :src="src" alt="crest" />
</template>

<style scoped>
img {
  overflow-clip-margin: content-box;
  overflow: clip;
}
</style>
