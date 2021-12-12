<script setup lang="ts">
import { Field, useValidation } from 'vue3-form-validation'

import FormFileUpload from '~/components/form/FormFileUpload.vue'
import FormProvider from '~/components/form/FormProvider.vue'
import FormInput from '~/components/form/FormInput.vue'
import FormButtons from '~/components/form/FormButtons.vue'
import { rules } from '~/utils'

interface FormData {
  text: Field<string>
  files: Field<File[]>
}

const {
  form,
  submitting,
  validating,
  errors,
  hasError,
  validateFields,
  resetFields
} = useValidation<FormData>({
  text: {
    $value: '',
    $rules: [rules.min(6)('Please enter text longer than 5 characters')]
  },
  files: {
    $value: [],
    $rules: [rules.min(1)('Please select one or more files')]
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

<template>
  <FormProvider
    title="Home Form"
    class="grid gap-y-6 max-w-2xl"
    :validating="validating"
    :submitting="submitting"
    :has-error="hasError"
    :errors="errors"
    :form="form"
    @submit="handleSubmit()"
  >
    <div>
      <FormInput
        :label="{ value: 'Enter some text', for: 'text' }"
        :errors="form.text.$errors"
        :classes="{
          input: 'w-3/4 lg:w-1/3'
        }"
        v-model="form.text.$value"
        @blur="form.text.$validate()"
      />
    </div>
    <FormFileUpload
      label="Select some Files"
      multiple
      :errors="form.files.$errors"
      v-model="form.files.$value"
    >
    </FormFileUpload>
    <FormButtons class="mt-2" :submitting="submitting" @reset="resetFields()" />
  </FormProvider>
</template>
