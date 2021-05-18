<template>
  <div>
    <div class="relative flex items-center">
      <input
        v-model="value"
        :disabled="disabled"
        :placeholder="placeholder"
        v-bind="$attrs"
        class="
          focus:outline-none
          focus:ring-1 focus:ring-blue-500
          focus:border-blue-500
        "
        :class="{
          'bg-red-50 border-red-500 focus:ring-1 focus:ring-red-500 focus:border-red-500':
            errors.length > 0 || hasError
        }"
      />
      <IconLoading
        v-if="validating"
        class="w-4 h-4 absolute right-3 text-blue-500"
        :class="{ 'text-red-500': errors.length > 0 || hasError }"
        spin
      />
    </div>
    <div v-if="errors.length" class="mt-1 text-sm text-red-500">
      <div v-for="(error, i) in errors" :key="i">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import IconLoading from '../../icons/IconLoading.vue';

export default defineComponent({
  components: { IconLoading },
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Number, Boolean, Array],
      default: ''
    },
    errors: {
      type: Array,
      default: () => []
    },
    validating: {
      type: Boolean
    },
    disabled: {
      type: Boolean
    },
    placeholder: {
      type: String,
      default: ''
    },
    hasError: {
      type: Boolean
    }
  },
  emits: ['update:modelValue'],
  computed: {
    value: {
      get(): any {
        return this.modelValue;
      },
      set(value: any) {
        this.$emit('update:modelValue', value);
      }
    }
  }
});
</script>

<style scoped></style>
