<template>
  <section>
    <form @submit.prevent="">
      <label class="block">
        <span>Input (file)</span>
        <input type="file" class="block mt-1" />
      </label>
      <button type="submit">Submit</button>
    </form>
    <pre>{{ form }}</pre>
  </section>
</template>

<script setup lang="ts">
import { useValidation } from 'vue3-form-validation'

const { form, add } = useValidation({
  text: {
    $value: ''
  }
})

add(['awd'], {
  a: ''
})
</script>
