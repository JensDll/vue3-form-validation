<template>
  <h1 class="font-semibold text-2xl">Test Form</h1>
  <BaseInput v-model="bool" type="checkbox" />
</template>

<script lang="ts">
import BaseInput from '../components/form/BaseInput.vue';
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  components: {
    BaseInput
  },
  setup() {
    const bool = ref(false);

    watch(bool, bool => {
      console.log(bool);
    });

    return {
      bool
    };
  }
});
</script>

<style></style>
