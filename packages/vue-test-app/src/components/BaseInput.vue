<template>
  <div class="relative" :class="attrsClassName">
    <input
      :class="['w-full border p-3 rounded', { 'border-red-500': hasError }]"
      :disabled="disabled"
      :placeholder="placeholder"
      v-bind="attrsRest"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <LoadingIcon
      v-if="validating"
      class="loading-icon"
      :class="{ 'loading-icon-error': hasError }"
    />
  </div>
</template>

<script lang="ts">
import LoadingIcon from './icons/LoadingIcon.vue';

import { defineComponent } from 'vue';

export default defineComponent({
  components: { LoadingIcon },
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Number, Boolean],
      required: true
    },
    validating: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    hasError: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  setup(props, { attrs }) {
    const { class: attrsClassName, ...attrsRest } = attrs;

    return {
      attrsClassName,
      attrsRest
    };
  }
});
</script>

<style lang="postcss" scoped>
.loading-icon {
  position: absolute;
  top: 50%;
  right: 0.75rem;
  width: 14px;
  height: 14px;
  margin-top: -7px;
  color: theme('colors.green.500');
}

.loading-icon-error {
  color: theme('colors.red.500');
}
</style>
