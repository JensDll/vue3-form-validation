<template>
  <main class="main px-16 pb-16">
    <router-view />
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({});
</script>

<style scoped>
.main {
  grid-area: main;
}
</style>
