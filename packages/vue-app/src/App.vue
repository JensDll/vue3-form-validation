<template>
  <FileForm />
</template>

<script setup lang="ts">
import FileForm from './pages/FileForm.vue'
</script>

<style lang="postcss">
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

#app {
  @apply container mx-auto mt-16 font-body;
}

@layer components {
  .form-input {
    &:focus,
    &:focus-within {
      @apply border-indigo-300 ring ring-indigo-200 ring-opacity-50 !important;
    }

    &.error {
      @apply border-red-300 bg-red-50 !important;

      &:focus,
      &:focus-within {
        @apply ring ring-red-200 ring-opacity-50 !important;
      }
    }
  }
}
</style>
