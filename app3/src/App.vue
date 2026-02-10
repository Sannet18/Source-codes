<script setup>
import Buttons from './components/Buttons.vue'
import Grid from './components/Grid.vue'
import Adam from './assets/Adam.jpg'
import { ref } from 'vue'

const positions = {
  slot1: '0% 0%',
  slot2: '60% 20%',
  slot3: '100% 0%',
  slot4: '0% 60%',
  slot5: '50% 60%',
  slot6: '100% 60%',
  slot7: '0% 100%',
}

const correct = {
  slot1: {
    position: '0% 0%',
    size: '233.3% 233.3%',
  },
  slot2: {
    position: '60% 0%',
    size: '350% 233.3%',
  },
  slot3: {
    position: '100% 0%',
    size: '350% 233.3%',
  },
  slot4: {
    position: '0% 60%',
    size: '350% 350%',
  },
  slot5: {
    position: '50% 60%',
    size: '233.3% 350%',
  },
  slot6: {
    position: '100% 60%',
    size: '350% 350%',
  },
  slot7: {
    position: '0% 100%',
    size: '100% 350%',
  },
}

const slots = ref(Object.entries(positions))
const reveal = ref(false)

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

function scramble() {
  reveal.value = false
  slots.value = shuffle(slots.value)
  console.log('Scrambled')
}

function identify() {
  reveal.value = true
  console.log('Identify')
}
</script>

<template>
  <div class="root">
    <Grid>
      <template #slot1>
        <div
          v-if="reveal"
          class="displayImg"
          :style="{
            backgroundImage: `url(${Adam})`,
            backgroundPosition: correct.slot1.position,
            backgroundSize: correct.slot1.size,
          }"
        ></div>
        <div
          v-else
          class="displayImg"
          :style="{ backgroundImage: `url(${Adam})`, backgroundPosition: slots[0][1] }"
        ></div>
      </template>
      <template #slot2>
        <div
          v-if="reveal"
          class="displayImg"
          :style="{
            backgroundImage: `url(${Adam})`,
            backgroundPosition: correct.slot2.position,
            backgroundSize: correct.slot2.size,
          }"
        ></div>
        <div
          v-else
          class="displayImg"
          :style="{ backgroundImage: `url(${Adam})`, backgroundPosition: slots[1][1] }"
        ></div>
      </template>
      <template #slot3>
        <div
          v-if="reveal"
          class="displayImg"
          :style="{
            backgroundImage: `url(${Adam})`,
            backgroundPosition: correct.slot3.position,
            backgroundSize: correct.slot3.size,
          }"
        ></div>
        <div
          v-else
          class="displayImg"
          :style="{ backgroundImage: `url(${Adam})`, backgroundPosition: slots[2][1] }"
        ></div>
      </template>
      <template #slot4>
        <div
          v-if="reveal"
          class="displayImg"
          :style="{
            backgroundImage: `url(${Adam})`,
            backgroundPosition: correct.slot4.position,
            backgroundSize: correct.slot4.size,
          }"
        ></div>
        <div
          v-else
          class="displayImg"
          :style="{ backgroundImage: `url(${Adam})`, backgroundPosition: slots[3][1] }"
        ></div>
      </template>
      <template #slot5>
        <div
          v-if="reveal"
          class="displayImg"
          :style="{
            backgroundImage: `url(${Adam})`,
            backgroundPosition: correct.slot5.position,
            backgroundSize: correct.slot5.size,
          }"
        ></div>
        <div
          v-else
          class="displayImg"
          :style="{ backgroundImage: `url(${Adam})`, backgroundPosition: slots[4][1] }"
        ></div>
      </template>
      <template #slot6>
        <div
          v-if="reveal"
          class="displayImg"
          :style="{
            backgroundImage: `url(${Adam})`,
            backgroundPosition: correct.slot6.position,
            backgroundSize: correct.slot6.size,
          }"
        ></div>
        <div
          v-else
          class="displayImg"
          :style="{ backgroundImage: `url(${Adam})`, backgroundPosition: slots[5][1] }"
        ></div>
      </template>
      <template #slot7>
        <div
          v-if="reveal"
          class="displayImg"
          :style="{
            backgroundImage: `url(${Adam})`,
            backgroundPosition: correct.slot7.position,
            backgroundSize: correct.slot7.size,
          }"
        ></div>
        <div
          v-else
          class="displayImg"
          :style="{ backgroundImage: `url(${Adam})`, backgroundPosition: slots[6][1] }"
        ></div>
      </template>
    </Grid>

    <Buttons @scramble="scramble" @identify="identify" />
  </div>
</template>

<style scoped>
.root {
  position: relative;
  width: 100%;
  height: 100%;
}
.displayImg {
  width: 100%;
  height: 100%;
  background-size: 250% 340%;
  background-repeat: no-repeat;
  overflow: auto;
}
</style>
