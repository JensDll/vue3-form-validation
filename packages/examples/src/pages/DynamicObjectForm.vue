<template>
  <FormProvider title="Dynamic Object Form" :form="form" class="form">
    <div v-for="[key, field] in Object.entries(form)">
      <label :for="key" class="form-label capitalize">{{ key }}</label>
      <input type="text" v-model="field.$value" class="form-input" />
    </div>
    <FormButtons @submit="handleSubmit()" @reset="resetFields()" />
  </FormProvider>
</template>

<script setup lang="ts">
import FormProvider from '~/components/layout/FormProvider.vue'
import FormButtons from './components/FormButtons.vue'
import { Field, useValidation } from 'vue3-form-validation'

type FormData = {
  a: Field<string>
  b?: Field<string>
  c?: Field<string>
}

const { form, validateFields, resetFields } = useValidation<FormData>({
  a: {
    $value: ''
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

<style lang="postcss" scoped>
:deep(.form) {
  display: grid;
}
</style>
