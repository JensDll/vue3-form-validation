<script lang="ts">
import { defineComponent, useAttrs } from 'vue'

export default defineComponent({
  inheritAttrs: false
})
</script>

<script setup lang="ts">
import PreFormData from '~/components/form/PreFormData.vue'

defineEmits(['submit'])
defineProps({
  title: {
    type: String,
    required: true
  },
  form: {
    type: Object
  },
  submitting: {
    type: Boolean
  }
})

const { class: attrsClass, onSubmit, ...attrsRest } = useAttrs()
</script>

<template>
  <section class="w-full max-w-2xl" v-bind="attrsRest">
    <h1 class="font-semibold text-2xl mb-8">{{ title }}</h1>
    <form
      :class="attrsClass"
      autocomplete="off"
      @submit.prevent="$emit('submit')"
    >
      <slot></slot>
    </form>
    <PreFormData v-if="form" :form="form" />
  </section>
</template>

<style lang="postcss" scoped></style>
