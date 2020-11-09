<template>
  <TheHeader />
  <TheNav />
  <TheMain />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TheHeader from './components/TheHeader.vue';
import TheNav from './components/TheNav.vue';
import TheMain from './components/TheMain.vue';

export default defineComponent({
  components: {
    TheHeader,
    TheNav,
    TheMain
  }
});
</script>

<style>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

#app {
  height: 100vh;
  display: grid;
  row-gap: 50px;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    'header header'
    'nav main';
}
</style>
