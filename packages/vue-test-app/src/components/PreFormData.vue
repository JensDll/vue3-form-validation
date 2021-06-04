<template>
  <pre>{{ errors }}</pre>
  <pre class="mt-2">{{ formJSON }}</pre>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    form: {
      type: Object,
      required: true
    },
    errors: {
      type: Array,
      required: true
    }
  },
  computed: {
    formJSON() {
      return JSON.stringify(
        this.form,
        (k, v) => (typeof v === 'function' ? 'function' : v),
        2
      );
    }
  }
});
</script>
