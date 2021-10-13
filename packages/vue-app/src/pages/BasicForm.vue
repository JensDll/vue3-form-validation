<template>
  <FormProvider title="Basic Form" class="grid gap-y-6 max-w-2xl" :form="form">
    <div>
      <label for="text" class="form-label">Enter some Text</label>
      <input
        type="text"
        id="text"
        :class="['text-sm form-input', { error: form.text.$hasError }]"
        @blur="form.text.$setTouched()"
        v-model="form.text.$value"
      />
      <FormErrors :errors="form.text.$errors" class="mt-2" />
    </div>
    <FormFileUpload
      label="Select some Files"
      v-model="form.files.$value"
      :errors="form.files.$errors"
      multiple
    >
    </FormFileUpload>
    <FormButtons
      :submitting="submitting"
      @reset="resetFields()"
      @submit="handleSubmit()"
      class="mt-2"
    />
  </FormProvider>
</template>

<script setup lang="ts">
import FormFileUpload from '~/components/form/FormFileUpload.vue'
import { Field, useValidation } from 'vue3-form-validation'
import { rules } from '~/domain'
import FormProvider from '~/components/layout/FormProvider.vue'
import FormErrors from '~/components/form/FormErrors.vue'
import FormButtons from './components/FormButtons.vue'

interface FormData {
  files: Field<File[]>
  text: Field<string>
}

const { form, submitting, validateFields, resetFields } =
  useValidation<FormData>({
    files: {
      $value: [],
      $rules: [rules.min(1)('Please select one or more files')]
    },
    text: {
      $value: '',
      $rules: [
        rules.min(6)('Please enter some text that is longer than 5 characters')
      ]
    }
  })

async function handleSubmit() {
  try {
    const formData = await validateFields()
    console.log(formData)
  } catch (e) {
    console.log(e)
  }
}
</script>
