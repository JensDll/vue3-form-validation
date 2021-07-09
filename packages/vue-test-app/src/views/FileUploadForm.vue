<template>
  <form class="w-1/2" @submit.prevent="handleSubmit()">
    <file-upload label="Model and Label File" v-model="form.files.$value" />
    <div class="mt-8">
      <base-button class="font-semibold px-6 py-2 rounded" html-type="submit">
        Load
      </base-button>
      <base-button
        class="font-semibold px-6 py-2 rounded"
        @click="resetFields()"
      >
        Reset
      </base-button>
    </div>
  </form>
  <pre>{{ form }}</pre>
</template>

<script setup lang="ts">
import FileUpload from '../components/FileUpload.vue';
import BaseButton from '../components/BaseButton.vue';
import { useValidation } from 'vue3-form-validation';
import type { Field } from 'vue3-form-validation';

type FormData = {
  files: Field<File[]>;
};

const { form, validateFields, resetFields } = useValidation<FormData>({
  files: {
    $value: []
  }
});

const handleSubmit = async () => {
  try {
    console.log(form);
    const formData = await validateFields();
    console.log(formData);
  } catch {
    console.log('Error');
  }
};
</script>

<style lang="postcss"></style>
