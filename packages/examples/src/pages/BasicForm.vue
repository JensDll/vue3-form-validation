<template>
  <FormProvider
    title="Basic Form"
    class="grid gap-y-6 max-w-2xl"
    :form="form"
    @submit="handleSubmit()"
  >
    <div>
      <label for="text" class="form-label">Enter some Text</label>
      <input
        id="text"
        :class="['text-sm form-input', { error: form.text.$hasError }]"
        type="text"
        v-model="form.text.$value"
        @blur="form.text.$validate()"
      />
      <FormErrors class="mt-2" :errors="form.text.$errors" />
    </div>
    <FormFileUpload
      label="Select some Files"
      :errors="form.files.$errors"
      multiple
      v-model="form.files.$value"
    >
    </FormFileUpload>
    <FormButtons class="mt-2" :submitting="submitting" @reset="resetFields()" />
  </FormProvider>
</template>

<script setup lang="ts">
import { Field, useValidation } from 'vue3-form-validation'

import FormFileUpload from '~/components/form/FormFileUpload.vue'
import FormProvider from '~/components/form/FormProvider.vue'
import FormErrors from '~/components/form/FormErrors.vue'
import FormButtons from '~/components/form/FormButtons.vue'
import { rules } from '~/domain'

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
