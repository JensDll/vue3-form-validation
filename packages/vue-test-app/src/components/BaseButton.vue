<template>
  <button
    class="
      flex
      justify-center
      items-center
      border
      p-2
      focus:outline-none
      focus:ring focus:ring-offset-2
    "
    :class="[{ 'opacity-40 pointer-events-none': disabled }, type]"
    :type="htmlType"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'VButton',
  props: {
    loading: {
      type: Boolean
    },
    disabled: {
      type: Boolean
    },
    htmlType: {
      type: String as PropType<'button' | 'submit' | 'reset'>,
      default: 'button'
    },
    type: {
      type: String as PropType<'primary' | 'secondary'>,
      default: 'primary'
    }
  }
});
</script>

<style lang="postcss" scoped>
.primary {
  @apply bg-blue-500 text-white;

  &:focus {
    @apply ring-blue-300;
  }
}

.secondary {
  @apply bg-violet-500 text-white;

  &:focus {
    @apply ring-violet-300;
  }
}
</style>
