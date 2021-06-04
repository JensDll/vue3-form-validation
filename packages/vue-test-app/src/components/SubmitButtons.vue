<template>
  <div
    class="grid grid-flow-col"
    :style="{
      'column-gap': gap,
      'grid-template-columns': `${r1}fr ${r2}fr`
    }"
  >
    <BaseButton
      class="py-4"
      html-type="submit"
      type="primary"
      :disabled="submitting"
    >
      {{ submitText }}
    </BaseButton>
    <BaseButton class="py-4" type="secondary" @click="$emit('reset')">
      Reset
    </BaseButton>
  </div>
</template>

<script>
import BaseButton from './BaseButton.vue';

export default {
  components: {
    BaseButton
  },
  props: {
    submitText: {
      type: String,
      default: 'Submit'
    },
    gap: {
      type: String,
      required: true
    },
    ratio: {
      type: String,
      default: '1:1'
    },
    submitting: {
      type: Boolean,
      default: false
    }
  },
  emits: ['reset'],
  computed: {
    r1() {
      return this.ratio.split(':')[0];
    },
    r2() {
      return this.ratio.split(':')[1];
    }
  }
};
</script>
