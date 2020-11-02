<template>
  <button
    :class="['button', type, { disabled }]"
    :type="htmlType"
    :disabled="disabled"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    htmlType: {
      type: String,
      default: 'button',
      validator: (htmlType: string) =>
        ['button', 'reset', 'submit'].includes(htmlType)
    },
    type: {
      type: String,
      default: 'default',
      validator: (type: string) =>
        ['default', 'primary', 'danger'].includes(type)
    },
    disabled: {
      type: Boolean
    }
  }
});
</script>

<style scoped>
.button {
  @apply block px-8 py-2 border outline-none shadow-none transition-colors duration-100;
  min-width: 6rem;
}

.disabled {
  @apply bg-gray-300 border-gray-500 cursor-not-allowed !important;
  opacity: 0.3;
}

.default:hover {
  @apply border-green-500;
}

.default:focus {
  @apply border-green-500;
  box-shadow: 0 0 3px theme('colors.green.500');
}

.primary {
  @apply border-green-500 bg-green-100;
}

.primary:hover {
  @apply bg-green-200;
}

.primary:focus {
  box-shadow: 0 0 3px theme('colors.green.500');
}

.danger {
  @apply border-red-500 bg-red-100;
}

.danger:hover {
  @apply bg-red-200;
}

.danger:focus {
  box-shadow: 0 0 3px theme('colors.red.500');
}
</style>
