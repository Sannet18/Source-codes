<script setup>
const emit = defineEmits(['identify', 'scramble'])
</script>

<template>
  <div class="buttons">
    <button class="identify" @click="emit('identify')">Identify</button>
    <button class="scramble" @click="emit('scramble')">Scramble</button>
  </div>
</template>

<style scoped>
.buttons {
  width: 250px;
  height: 50px;
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  margin: auto;
}

button {
  width: 100%;
  height: 50%;
  border: none;
  color: #ffff;
  font-size: 20px;
  cursor: pointer;
  background-color: burlywood;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
    margin: 5px;
}

.identify {
  border-radius: 5%;
}

.scramble {
  border-radius: 5%;
}

button:active {
  transform: scale(0.95);
}
</style>
