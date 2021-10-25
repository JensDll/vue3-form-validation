<script setup lang="ts">
import { PropType, computed } from 'vue'

import LoadingIcon from '~/components/icon/LoadingIcon.vue'
import FormErrors from './FormErrors.vue'

type FormInputClasses = {
  label?: string
  input?: string
  error?: string
}

type FormLabel = {
  value?: string
  for: string
}

const emit = defineEmits(['update:modelValue', 'blur'])
const props = defineProps({
  modelValue: {
    type: [String, Number, Array] as PropType<any>,
    required: true
  },
  label: {
    type: Object as PropType<FormLabel>
  },
  classes: {
    type: Object as PropType<FormInputClasses>,
    default: (): FormInputClasses => {
      return {
        label: '',
        input: '',
        error: ''
      }
    }
  },
  validating: {
    type: Boolean
  },
  errors: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  hasError: {
    type: Boolean
  },
  type: {
    type: String,
    default: 'text'
  }
})

const value = computed<any>({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
</script>

<template>
  <label
    v-if="label?.value"
    :for="label.for"
    :class="['form-label', classes.label]"
  >
    {{ label.value }}
  </label>
  <div :class="['relative flex items-center', classes.input]">
    <LoadingIcon
      v-show="validating"
      class="w-5 h-5 absolute right-4 text-indigo-600"
      :class="{ '!text-red-500': errors.length || hasError }"
      spin
    />
    <input
      :type="type"
      :id="label?.for"
      :class="[
        'form-input',
        { error: errors.length || hasError },
        { 'w-full': type !== 'checkbox' },
        { 'text-sm': type === 'text' }
      ]"
      v-bind="$attrs"
      v-model="value"
      @blur="emit('blur')"
    />
  </div>
  <FormErrors :errors="errors" :class="['mt-2', classes.error]" />
</template>

<style lang="postcss" scoped></style>
