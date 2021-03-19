<template>
  <NavLinks />
  <main>
    <router-view />
  </main>
</template>

<script lang="ts">
import NavLinks from './components/NavLinks.vue';

export default {
  components: { NavLinks }
};
</script>

<style>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

@layer base {
  h1 {
    @apply font-bold text-4xl;
  }

  @font-face {
    font-family: 'Montserrat', sans-serif;
    src: url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
  }
}

body {
  height: 100vh;
}

#app {
  padding: 60px;
  display: grid;
  row-gap: 60px;
  justify-items: center;
  grid-template-rows: auto 1fr;
  font-family: 'Montserrat', sans-serif;
}

main {
  width: 100%;
  max-width: 700px;
  min-width: 600px;
}
</style>
