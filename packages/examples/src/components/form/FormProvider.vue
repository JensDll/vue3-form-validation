<template>
  <section class="w-full xl:w-3/4" v-bind="attrsRest">
    <h1 class="font-semibold text-2xl mb-8">{{ title }}</h1>
    <form
      :class="attrsClass"
      autocomplete="off"
      @submit.prevent="$emit('submit')"
    >
      <slot></slot>
    </form>
    <PreFormData :form="form" />
  </section>
</template>

<script lang="ts">
import { defineComponent, useAttrs } from 'vue'

export default defineComponent({
  inheritAttrs: false
})
</script>

<script setup lang="ts">
import { ref, onMounted, Ref } from 'vue'
import PreFormData from '~/components/form/PreFormData.vue'

const formRef = ref() as Ref<HTMLFormElement>

defineEmits(['submit'])
defineProps({
  title: {
    type: String,
    required: true
  },
  form: {
    type: Object,
    required: true
  },
  submitting: {
    type: Boolean
  }
})

const { class: attrsClass, onSubmit, ...attrsRest } = useAttrs()
</script>

<style lang="postcss" scoped></style>
