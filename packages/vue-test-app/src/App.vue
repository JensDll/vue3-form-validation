<template>
  <NavLinks />
  <main>
    <router-view />
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import NavLinks from './components/NavLinks.vue';

export default defineComponent({
  components: { NavLinks }
});
</script>

<style lang="postcss">
body {
  height: 100vh;
}

#app {
  padding: 60px;
  display: grid;
  row-gap: 60px;
  justify-items: center;
  grid-template-rows: auto 1fr;
}

main {
  width: 100%;
  max-width: 700px;
  min-width: 540px;
}

.form-label {
  @apply block mb-2 font-semibold;
}
</style>
