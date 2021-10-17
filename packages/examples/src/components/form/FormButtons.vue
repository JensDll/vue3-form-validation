<template>
  <div class="flex">
    <BaseButton
      class="px-4 py-2 rounded-md font-medium"
      :disabled="submitting"
      html-type="submit"
    >
      Submit
    </BaseButton>
    <BaseButton
      class="px-4 py-2 rounded-md font-medium ml-4"
      type="secondary"
      @click="$emit('reset')"
    >
      Reset
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '~/components/base/BaseButton.vue'

defineEmits(['reset', 'submit'])

defineProps({
  submitting: {
    type: Boolean
  }
})
</script>

<style lang="postcss" scoped></style>
