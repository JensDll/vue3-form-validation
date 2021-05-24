<template>
  <div>
    <pre class="mb-2">{{ errors }}</pre>
    <pre>{{ formJSON }}</pre>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars*/
import { computed, defineProps } from 'vue';
import type { PropType } from 'vue';

const props = defineProps({
  form: {
    type: Object,
    required: true
  },
  errors: {
    type: Array as PropType<string[]>,
    required: true
  }
});

const formJSON = computed(() => {
  return JSON.stringify(
    props.form,
    (k, v) => {
      switch (typeof v) {
        case 'function':
          return 'function';
        case 'undefined':
          return 'undefined';
        default:
          return v;
      }
    },
    2
  );
});
</script>
