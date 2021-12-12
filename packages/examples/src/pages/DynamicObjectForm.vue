<script setup lang="ts">
import { PlusCircleIcon, MinusCircleIcon } from '@heroicons/vue/outline'
import { Field, useValidation } from 'vue3-form-validation'

import FormInput from '~/components/form/FormInput.vue'
import FormProvider from '~/components/form/FormProvider.vue'
import FormButtons from '~/components/form/FormButtons.vue'
import { rules } from '~/utils'

type FormData = {
  a: Field<string>
  b?: Field<string>
  c?: Field<string>
}

const {
  form,
  hasError,
  errors,
  validating,
  submitting,
  validateFields,
  resetFields,
  add,
  remove
} = useValidation<FormData>({
  a: {
    $value: '',
    $rules: [rules.required('Please enter some text')]
  },
  b: undefined,
  c: undefined
})

function addField(key: string) {
  add([key], {
    $value: '',
    $rules: [rules.required('Please enter some text')]
  })
}

function removeField(key: string) {
  remove([key])
  add([key], undefined)
}

async function handleSubmit() {
  try {
    const formData = await validateFields({
      predicate: ({ value }) => value !== undefined
    })
    console.log(formData)
  } catch (e) {
    console.log(e)
  }
}
</script>

<template>
  <FormProvider
    title="Dynamic Object Form"
    class="form"
    :validating="validating"
    :submitting="submitting"
    :has-error="hasError"
    :errors="errors"
    :form="form"
    @submit="handleSubmit()"
  >
    <template v-for="[key, field] in Object.entries(form)" :key="key">
      <div v-if="field" class="field-container">
        <FormInput
          :label="{
            for: key,
            value: key
          }"
          :classes="{
            label: 'label capitalize',
            input: 'input',
            error: 'error'
          }"
          :errors="field.$errors"
          v-model="field.$value"
          @blur="field.$validate()"
        />
        <MinusCircleIcon
          v-if="key !== 'a'"
          class="minus-circle ml-4"
          @click="removeField(key)"
        />
      </div>
      <PlusCircleIcon v-else class="plus-circle" @click="addField(key)" />
    </template>
    <FormButtons class="mt-6" @reset="resetFields()" />
  </FormProvider>
</template>

<style lang="postcss" scoped>
:deep(.form) {
  @apply grid gap-y-4;
}

.field-container {
  display: grid;
  grid-template-columns: 1fr 4rem;
  grid-template-rows: repeat(3 auto);
  grid-template-areas:
    'label .'
    'input icon'
    'error .';
}

.minus-circle {
  align-self: center;
  justify-self: end;
  grid-area: icon;
}

:deep(.label) {
  grid-area: label;
}

:deep(.input) {
  grid-area: input;
}

:deep(.error) {
  grid-area: error;
}
</style>
