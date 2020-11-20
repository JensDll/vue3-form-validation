<template>
  <h1 class="font-semibold text-2xl">Test Form</h1>
</template>

<script>
import { defineComponent } from 'vue';
import { useValidation } from '../../main/composable/useValidation';

export default defineComponent({
  setup() {
    const { form } = useValidation({
      name: {
        $value: '',
        $rules: [name => name]
      }
    });

    return {
      form
    };
  }
});
</script>

<style></style>
