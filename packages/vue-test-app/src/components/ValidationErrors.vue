<template>
  <div v-if="errors.length > 0" class="mt-1 text-sm text-red-500">
    <p v-for="(error, i) in errors" :key="i" class="break-words">{{ error }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  props: {
    errors: {
      type: Array as PropType<string[]>,
      required: true
    }
  }
});
</script>
