<script setup lang="ts">
import { computed, PropType } from 'vue'

const props = defineProps({
  validating: {
    type: Boolean,
    required: true
  },
  submitting: {
    type: Boolean,
    required: true
  },
  hasError: {
    type: Boolean,
    required: true
  },
  errors: {
    type: Object as PropType<string[]>,
    required: true
  },
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

<template>
  <h3 class="mt-16 text-lg">UseValidation State</h3>
  <pre class="mt-2">Validating: {{ validating }}</pre>
  <pre class="mt-1">Submitting: {{ submitting }}</pre>
  <pre class="mt-1">Has Error: {{ hasError }}</pre>
  <pre class="mt-1">Errors: {{ errors }}</pre>
  <pre class="mt-1">Form: {{ formJson }}</pre>
</template>

<style lang="postcss" scoped></style>
