<template>
  <button
    class="focus:outline-none ring-offset-2 focus:ring-2 duration-150"
    :class="[
      { 'opacity-40 cursor-not-allowed disabled duration-75': disabled },
      { 'opacity-40 cursor-wait disabled': loading },
      reverse ? `reverse-${type}` : type
    ]"
    :aria-disabled="disabled || loading"
    :type="htmlType"
    @click="onClick"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'

const emit = defineEmits(['click', 'submit'])
const props = defineProps({
  loading: {
    type: Boolean
  },
  disabled: {
    type: Boolean
  },
  htmlType: {
    type: String as PropType<'button' | 'reset'>,
    default: 'button'
  },
  type: {
    type: String as PropType<'basic' | 'primary' | 'secondary' | 'danger'>,
    default: 'primary'
  },
  reverse: {
    type: Boolean
  }
})

const onClick = (e: MouseEvent) => {
  const target = e.target as HTMLButtonElement
  if (target.ariaDisabled === 'false') {
    emit('click')
  }
}
</script>

<style lang="postcss" scoped>
button {
  transition-property: colors opacity;
}

.basic,
.reverse-basic {
  @apply border-2 border-gray-300;
  &:hover {
    @apply bg-gray-50;
  }
  &:focus {
    @apply ring-gray-300;
  }
}
.primary {
  @apply bg-indigo-500 text-white;
  &:not(.disabled):hover {
    @apply bg-indigo-400;
  }
  &:focus {
    @apply ring-indigo-500;
  }
}

.secondary {
  @apply bg-emerald-500 text-white;
  &:not(.disabled):hover {
    @apply bg-emerald-400;
  }
  &:focus {
    @apply ring-emerald-500;
  }
}

.danger {
  @apply bg-red-500 text-white;
  &:not(.disabled):hover {
    @apply bg-red-400;
  }
  &:focus {
    @apply ring-red-500;
  }
}

.reverse-primary {
  @apply border-2 border-blue-500 text-blue-500;
  &:not(.disabled):hover {
    @apply bg-blue-50;
  }
  &:focus {
    @apply ring-blue-500;
  }
}

.reverse-secondary {
  @apply border-2 border-emerald-500 text-emerald-500;
  &:not(.disabled):hover {
    @apply bg-emerald-50;
  }
  &:focus {
    @apply ring-emerald-500;
  }
}

.reverse-danger {
  @apply border-2 border-red-500 text-red-500;
  &:not(.disabled):hover {
    @apply bg-red-50;
  }
  &:focus {
    @apply ring-red-500;
  }
}
</style>
