<template>
  <NavLinks />
  <main>
    <router-view />
  </main>
</template>

<script>
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
    @apply font-bold text-3xl;
  }

  @font-face {
    font-family: 'Montserrat', sans-serif;
    src: url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');
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
