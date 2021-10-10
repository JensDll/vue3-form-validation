<template>
  <section class="w-full xl:w-3/4" v-bind="attrsRest">
    <h1 class="font-semibold text-2xl mb-12">{{ title }}</h1>
    <form
      @submit.prevent="$emit('submit')"
      :class="attrsClass"
      autocomplete="off"
    >
      <slot></slot>
      <div class="flex mt-4">
        <BaseButton html-type="submit" class="px-4 py-2 rounded-md font-medium">
          Submit
        </BaseButton>
        <BaseButton
          class="px-4 py-2 rounded-md font-medium ml-4"
          type="secondary"
          @click="$emit('reset')"
        >
          Reset
        </BaseButton>
      </div>
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
import BaseButton from '~/components/base/BaseButton.vue'
import PreFormData from '~/components/form/PreFormData.vue'

defineEmits(['submit', 'reset'])
defineProps({
  title: {
    type: String,
    required: true
  },
  form: {
    type: Object,
    required: true
  }
})

const { class: attrsClass, onSubmit, ...attrsRest } = useAttrs()
</script>

<style lang="postcss" scoped></style>
