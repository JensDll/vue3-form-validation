<template>
  <main class="main">
    <div class="main-container">
      <router-view></router-view>
    </div>
  </main>
</template>

<script setup lang="ts"></script>

<style scoped lang="postcss">
.main {
  width: 100%;
  grid-area: main;
  display: grid;
  justify-items: center;
}

.main-container {
  width: 80%;
  max-width: 1000px;
}
</style>
