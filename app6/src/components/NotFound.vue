<script setup></script>

<template>
  <div class="not-found-view view">
    <h1>404: Not Found</h1>
  </div>
</template>

<style scoped>
.not-found-view {
  box-sizing: border-box;
  padding: 20px;
  background-color: #efeded;
  opacity: 97%;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}
.view {
  position: relative;
}
.view:after {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  content: '';
  background-image: url(/starfish.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  filter: grayscale(100%);
  opacity: 0.05;
  z-index: -1;
}
</style>
