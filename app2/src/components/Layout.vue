<script setup>
import Image from './Image.vue'
import crest from '../assets/mcgregor_crest_coat_of_arms.png'
import { ref } from 'vue'
import Buttons from './Buttons.vue'

const changeText = ref(true)

function setA() {
  changeText.value = !changeText.value
}

const changeColour = ref(false)

function setB() {
  changeColour.value = !changeColour.value
}
</script>

<template>
  <section>
    <span>{{ changeText ? 'Sigma' : 'Alpha' }}</span>
  </section>
  <section class="top-right"></section>
  <section>
    <div class="crest">
      <Image :src="crest" />
    </div>
  </section>
  <section class="button-press">
    <div id="content" :class="{ wacky: changeColour }">
      <Buttons @a-pressed="setA" @b-pressed="setB" />
    </div>
  </section>
</template>

<style scoped>
.wacky {
  animation: pulse 3s ease-in-out infinite alternate;
}
@keyframes pulse {
  0% {
    filter: hue-rotate(0deg) saturate(1.5);
  }
  100% {
    filter: hue-rotate(360deg) saturate(3);
  }
}
#content {
  width: 100px;
  height: 200px;
  position: relative;
}
section {
  background-color: #dcdcdc;
  display: flex;
  align-items: center;
  justify-content: center;
}
.top-right {
  border-top-right-radius: 100%;
}

.crest img {
  animation: spinY-274d2d62 15s infinite ease-in-out;
  transform-style: preserve-3d;
}
@keyframes spinY-274d2d62 {
  0% {
    transform: rotate(0);
  }
  50% {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(360deg);
  }
}
span {
  font-size: 64px;
  font-family: Exile, system-ui;
  font-weight: 400;
  font-style: normal;
}
</style>
