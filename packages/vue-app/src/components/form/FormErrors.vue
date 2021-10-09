<template>
  <div class="text-red-500 text-sm" :class="{ '!m-0': errors.length === 0 }">
    <p v-for="(error, i) in errors" :key="i">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'

defineProps({
  errors: {
    type: Array as PropType<string[]>,
    required: true
  }
})
</script>

<style lang="postcss" scoped></style>
