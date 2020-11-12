<template>
  <div>
    <!-- <BaseInput label="Name" v-model="formData.name.value" /> -->
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, markRaw, reactive, ref, watch } from 'vue';
import BaseInput from '../components/form/BaseInput.vue';
import { useValidation, Field } from '../../main/composable/useValidation';

export default defineComponent({
  components: { BaseInput },
  setup() {
    const { form } = useValidation({
      name: {
        value: ''
      }
    });
  }
});
</script>

<style></style>
