<template>
  <ul
    class="text-red-500 text-sm break-words"
    :class="{ '!m-0': errors.length === 0 }"
  >
    <li v-for="(error, i) in errors" :key="i">
      {{ error }}
    </li>
  </ul>
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
