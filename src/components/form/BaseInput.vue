<template>
  <div :class="attrsClassName">
    <label>
      {{ label }}
      <input
        v-model="value"
        class="w-full border outline-none px-2 py-1 mt-2 input"
        :class="{ error: errors.length > 0 }"
        v-bind="attrsRest"
      />
    </label>
    <div v-if="errors.length" class="mt-2">
      <div
        v-for="(error, index) in errors"
        :key="index"
        class="text-sm text-red-500"
      >
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
      type: String,
      default: ''
    },
    modelValue: {
      type: [String, Number, Boolean],
      default: ''
    },
    errors: {
      type: Array as PropType<string[]>,
      default: () => []
    }
  },
  emits: ['update:modelValue'],
  setup(props, { attrs }) {
    const { class: attrsClassName, ...attrsRest } = attrs;

    return {
      attrsClassName,
      attrsRest
    };
  },
  computed: {
    value: {
      get(): string | number | boolean {
        return this.modelValue;
      },
      set(value: string | number | boolean) {
        this.$emit('update:modelValue', value);
      }
    }
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
