<template>
  <div>
    <BaseInput label="Name" v-model="formData.name.value" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, markRaw, reactive, ref, watch } from 'vue';
import BaseInput from '../components/form/BaseInput.vue';

export default defineComponent({
  components: { BaseInput },
  setup() {
    const name = ref('');

    watch(name, name => {
      console.log(name);
    });

    const formData = reactive({
      name: markRaw({
        value: name
      })
    });

    formData.name = {
      value: formData.name.value,
      test: 10
    };

    return {
      formData
    };
  }
});
</script>

<style></style>
