<template>
  <div>
    <pre class="mt-8">{{ formJson }}</pre>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  form: {
    type: Object,
    required: true
  }
})

const formJson = computed(() =>
  JSON.stringify(
    props.form,
    (key, value) => {
      if (value === undefined) {
        return 'undefined'
      }

      if (typeof value === 'function') {
        return 'function'
      }

      if (value instanceof File) {
        return `File { name: ${value.name} }`
      }

      return value
    },
    2
  )
)
</script>

<style lang="postcss" scoped></style>
