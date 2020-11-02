<template>
  <form @submit.prevent="handleSubmit">
    <slot :submitting="submitting"></slot>
  </form>
</template>

<script lang="ts">
import { provideBaseForm } from '../../../vue3-form-validation/index';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  emits: ['submit'],
  setup() {
    const { onSubmit } = provideBaseForm();
    const submitting = ref(false);

    return {
      onSubmit,
      submitting
    };
  },
  methods: {
    async handleSubmit() {
      this.submitting = true;
      const hasError = await this.onSubmit();

      if (!hasError) {
        this.$emit('submit');
      }
      this.submitting = false;
    }
  }
});
</script>
