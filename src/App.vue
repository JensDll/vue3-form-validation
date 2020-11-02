<template>
  <LoginForm />
  <ButtonDemo />
</template>

<script lang="ts">
import LoginForm from './views/LoginForm.vue';
import ButtonDemo from './views/ButtonDemo.vue';

import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    LoginForm,
    ButtonDemo
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
  place-items: center;
}
</style>
