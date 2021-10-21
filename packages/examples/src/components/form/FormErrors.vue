<script setup lang="ts">
import { computed, PropType } from 'vue'

const props = defineProps({
  errors: {
    type: Object as PropType<string[] | Set<string>>,
    required: true
  }
})

const hasNoError = computed<boolean>(() => {
  if (props.errors instanceof Set) {
    return props.errors.size === 0
  }
  return props.errors.length === 0
})
</script>

<template>
  <ul class="text-red-500 text-sm break-words" :class="{ '!m-0': hasNoError }">
    <li v-for="(error, i) in errors" :key="i">
      {{ error }}
    </li>
  </ul>
</template>

<style lang="postcss" scoped></style>
