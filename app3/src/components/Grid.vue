<script setup></script>

<template>
  <div class="grid-container">
    <div class="item1"><slot name="slot1">Slot1</slot></div>
    <div class="item2"><slot name="slot2">Slot2</slot></div>
    <div class="item3"><slot name="slot3">Slot3</slot></div>
    <div class="item4"><slot name="slot4">Slot4</slot></div>
    <div class="item5"><slot name="slot5">Slot5</slot></div>
    <div class="item6"><slot name="slot6">Slot6</slot></div>
    <div class="item7"><slot name="slot7">Slot7</slot></div>
  </div>
</template>

<style scoped>
.grid-container {
  display: grid;
  height: 90vh;
  width: 100vw;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(7, 1fr);
  background-color: turquoise;
  position: relative;
}
.grid-container > div {
  border: 1px solid black;
}

.item1 {
  grid-area: 1 / 1/ 4 / 4;
}
.item2 {
  grid-area: 1 / 4 / 4 / 6;
}
.item3 {
  grid-area: 1 / 6 / 4 / 8;
}
.item4 {
  grid-area: 4 / 1 / 6 / 3;
}
.item5 {
  grid-area: 4 / 3 / 6 / 6;
}
.item6 {
  grid-area: 4 / 6 / 6 / 8;
}
.item7 {
  grid-area: 6 / 1 / 8 / 8;
}
</style>