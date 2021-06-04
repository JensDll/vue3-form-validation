<template>
  <div>
    <h1 class="font-bold text-3xl">{{ title }}</h1>
    <form class="mt-10 mb-20" @submit.prevent="$emit('submit')">
      <slot></slot>
    </form>
    <PreFormData :form="form" :errors="errors" />
  </div>
</template>

<script>
import PreFormData from './PreFormData.vue';

export default {
  components: {
    PreFormData
  },
  props: {
    title: {
      type: String,
      required: true
    },
    form: {
      type: Object,
      required: true
    },
    errors: {
      type: Object,
      required: true
    }
  },
  emits: ['submit']
};
</script>
