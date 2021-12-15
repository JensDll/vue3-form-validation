<script setup lang="ts">
import TheNavLinks from './components/layout/TheNavLinks.vue'
</script>

<template>
  <TheNavLinks />
  <router-view></router-view>
</template>

<style lang="postcss">
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

#app {
  @apply mt-8 px-4 pb-32 font-sans grid justify-items-center gap-y-16;
}

@screen xs {
  #app {
    @apply px-6;
  }
}

@screen md {
  #app {
    @apply px-8 container mx-auto;
  }
}

@screen lg {
  #app {
    @apply px-14;
  }
}

@screen xl {
  #app {
    @apply px-20;
  }
}

@layer components {
  .form-input {
    @apply border border-gray-300 rounded-md;

    &:focus,
    &:focus-within {
      @apply border-indigo-300 ring ring-indigo-200 ring-opacity-50;
    }

    &.error {
      @apply border-red-300 bg-red-50;

      &:focus,
      &:focus-within {
        @apply ring ring-red-200 ring-opacity-50;
      }
    }
  }

  .form-label {
    @apply block text-gray-700 mb-2 font-medium;
  }

  .plus-circle {
    @apply w-6 h-6 text-indigo-500 cursor-pointer;

    &:hover {
      @apply text-indigo-600;
    }
  }

  .minus-circle {
    @apply w-6 h-6 text-red-500 cursor-pointer;

    &:hover {
      @apply text-red-600;
    }
  }

  .hide {
    @apply opacity-0 pointer-events-none;
  }
}
</style>
