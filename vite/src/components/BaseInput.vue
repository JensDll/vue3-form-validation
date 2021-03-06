<template>
  <div :class="attrsClassName">
    <label>
      {{ label }}
      <div class="relative mt-1">
        <input
          v-model="value"
          class="input w-full block border outline-none px-2 py-1"
          :class="{ error: errors.length > 0 }"
          :disabled="disabled"
          v-bind="attrsRest"
        />
        <span v-if="validating" class="ping-container">
          <div
            :class="[
              'animate-ping absolute inset-0 rounded-full opacity-75',
              errors.length > 0 ? 'bg-red-500' : 'bg-green-500'
            ]"
          ></div>
          <div
            :class="[
              'relative rounded-full w-full h-full border',
              errors.length > 0
                ? 'bg-red-50 border-red-500'
                : 'bg-green-50 border-green-500'
            ]"
          ></div>
        </span>
      </div>
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
    },
    validating: {
      type: Boolean
    },
    disabled: {
      type: Boolean
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

.ping-container {
  position: absolute;
  top: 50%;
  margin-top: -5px;
  right: 12px;
  width: 10px;
  height: 10px;
}
</style>
