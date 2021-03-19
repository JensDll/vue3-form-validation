<template>
  <h1>Array Binding</h1>
  <form class="mb-8 mt-10" @submit.prevent="handleSubmit()">
    <div>What is your favorite color?</div>
    <div v-for="color in colors" :key="color" class="color">
      <label>
        <input v-model="form.colors.$value" type="checkbox" :value="color" />
        {{ color }}
      </label>
    </div>
    <div v-if="errors.length" class="text-sm text-red-500">
      {{ errors[0] }}
    </div>
    <div class="flex mt-4">
      <BaseButton
        class="mr-2 py-1"
        type="primary"
        html-type="submit"
        :disabled="submitting"
      >
        Submit
      </BaseButton>
      <BaseButton class="py-1" @click="resetFields()">Reset</BaseButton>
    </div>
  </form>
  <PreFormData :form="form" :errors="errors" />
</template>

<script setup lang="ts">
import { ref } from '@vue/reactivity';
import { useValidation } from '../../../main';
import type { Field } from '../../../main';
import BaseButton from '../components/BaseButton.vue';
import PreFormData from '../components/PreFormData.vue';

interface FormData {
  colors: Field<string[]>;
}
const {
  form,
  errors,
  submitting,
  validateFields,
  resetFields
} = useValidation<FormData>({
  colors: {
    $value: [],
    $rules: [
      colors => colors.length < 2 && 'Select at least 2 colors',
      () =>
        new Promise<void>(resolve => {
          setTimeout(() => {
            resolve();
          }, 1000);
        })
    ]
  }
});

const handleSubmit = () => {
  validateFields()
    .then(formData => {
      console.log(JSON.stringify(formData, null, 2));
    })
    .catch(() => {
      // validation error
    });
};

const colors = ref(['Red', 'Green', 'Blue', 'Yellow', 'Black']);
</script>

<style scoped></style>
