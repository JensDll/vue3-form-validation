<template>
  <TheNavLinks />
  <TheMain />
</template>

<script setup lang="ts">
import TheNavLinks from './components/layout/TheNavLinks.vue';
import TheMain from './components/layout/TheMain.vue';
</script>

<style lang="postcss">
body {
  height: 100vh;
}

#app {
  padding: 6rem 0 0 0;
  display: grid;
  justify-items: center;
  row-gap: 4rem;
  grid-template-columns: 1fr;
  grid-template-areas:
    'nav-links'
    'main';
}
</style>
