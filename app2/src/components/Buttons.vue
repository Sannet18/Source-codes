<script setup>
const emit = defineEmits(['a-pressed', 'b-pressed'])
</script>

<template>
  <div class="buttons">
    <button class="top" @click="emit('a-pressed')">A</button>
    <button class="bottom" @click="emit('b-pressed')">B</button>
  </div>
</template>

<style scoped>
button {
  position: absolute;
  width: 100%;
  height: 50%;
  border: none;
  color: #ffff;
  font-size: 20px;
  cursor: pointer;
  background-color: #dc143c;
  transition:
    box-shadow 0.15s ease,
    transform 0.15s ease;
}
.top {
  top: 0;
  clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
}
button.top:active {
  box-shadow: inset 0 -4px 8px #0006;
  transform: scale(0.95);
}
button.bottom:active {
  box-shadow: inset 0 4px 8px #0006;
  transform: scale(0.95);
}
.bottom {
  bottom: 0;
  clip-path: polygon(0% 0%, 100% 0%, 50% 100%);
}
.buttons {
  width: 100px;
  height: 200px;
  position: relative;
}
</style>
