<template>
  <div :class="attrsClassName">
    <label class="flex items-center">
      <span>{{ label }}</span>
    </label>
    <input
      class="w-full border border-gray-300 outline-none px-2 py-1 mt-2 input"
      :class="{ error: errors.length > 0 }"
      v-bind="attrsRest"
      @input="e => $emit('update:modelValue', e.target.value)"
    />
    <div class="mt-2" v-if="errors.length">
      <div class="text-sm text-red-500" v-for="(error, index) in errors">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  inheritAttrs: false,
  props: {
    label: {
      type: String
    },
    modelValue: {
      type: [String, Number],
      default: ''
    },
    errors: {
      type: Array as PropType<string[]>,
      default: () => []
    }
  },
  setup(props, { attrs }) {
    const { class: attrsClassName, ...attrsRest } = attrs;

    return {
      attrsClassName,
      attrsRest
    };
  }
});
</script>

<style scoped>
.input:focus {
  @apply border-green-500;
  box-shadow: 0 0 3px theme('colors.green.500');
}

.error {
  @apply border-red-500;
}

.error:focus {
  @apply border-red-500;
  box-shadow: 0 0 3px theme('colors.red.500');
}
</style>
