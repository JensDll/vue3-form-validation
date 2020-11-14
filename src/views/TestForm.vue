<template>
  <h1 class="font-semibold text-2xl">Test Form</h1>
  <BaseInput type="checkbox" v-model="bool" />
</template>

<script lang="ts">
import BaseInput from '../components/form/BaseInput.vue';
import { defineComponent, reactive, ref, watch } from 'vue';

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
