<template>
  <h1>Array Binding</h1>
  <form class="my-8" @submit.prevent="handleSubmit">
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
      <BaseButton class="mr-2 py-1" type="primary" html-type="submit">
        Submit
      </BaseButton>
      <BaseButton class="py-1" @click="resetFields">Reset</BaseButton>
    </div>
  </form>
  <PreFormData :form="form" :errors="errors" />
</template>

<script lang="ts">
import { Field, useValidation } from '../../../main';
import BaseButton from '../components/BaseButton.vue';
import PreFormData from '../components/PreFormData.vue';

type FormData = {
  colors: Field<string[]>;
};

export default {
  components: {
    PreFormData,
    BaseButton
  },
  setup() {
    const {
      form,
      errors,
      validateFields,
      resetFields
    } = useValidation<FormData>({
      colors: {
        $value: [],
        $rules: [colors => colors.length < 2 && 'Select at least 2 colors']
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

    return {
      form,
      errors,
      handleSubmit,
      resetFields
    };
  },
  data() {
    return {
      colors: ['Red', 'Green', 'Blue', 'Yellow', 'Black']
    };
  }
};
</script>

<style scoped></style>
