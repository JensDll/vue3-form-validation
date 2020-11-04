<template>
  <div :class="attrsClassName">
    <label class="flex items-center" :for="uid">
      <span>{{ label }}</span>
    </label>
    <input
      class="w-full border border-gray-300 outline-none px-2 py-1 mt-2 input"
      :class="{ 'input-error': errors.length }"
      :id="uid"
      :type="type"
      v-bind="attrsRest"
      @input="e => $emit('update:modelValue', e.target.value)"
      @blur="onBlur"
    />
    <div class="mt-1">
      <div v-for="(error, i) in errors" :key="i" class="text-sm text-red-500">
        {{ error }}
      </div>
    </div>
    <div v-if="validating">VALIDATING</div>
  </div>
</template>

<script lang="ts">
import { useBaseForm, Rule, isSimpleRule } from '../../../vue3-form-validation';
import { defineComponent, PropType, toRef } from 'vue';

export default defineComponent({
  inheritAttrs: false,
  props: {
    label: {
      type: String
    },
    type: {
      type: String,
      default: 'text'
    },
    modelValue: {
      type: [String, Number],
      default: ''
    },
    rules: {
      type: Array as PropType<Rule[]>,
      default: () => [],
      validator: (rules: Rule[]) =>
        rules.every(
          rule =>
            isSimpleRule(rule) ||
            (typeof rule.key === 'string' && isSimpleRule(rule.rule))
        )
    }
  },
  setup(props, { attrs }) {
    const { uid, onBlur, errors, validating } = useBaseForm(
      toRef(props, 'modelValue'),
      toRef(props, 'rules')
    );

    const { class: attrsClassName, ...attrsRest } = attrs;

    return {
      uid,
      errors,
      onBlur,
      attrsClassName,
      attrsRest,
      validating
    };
  }
});
</script>

<style scoped>
.input:focus {
  @apply border-green-500;
  box-shadow: 0 0 3px theme('colors.green.500');
}

.input-error {
  @apply border-red-500;
}

.input-error:focus {
  @apply border-red-500;
  box-shadow: 0 0 3px theme('colors.red.500');
}
</style>
