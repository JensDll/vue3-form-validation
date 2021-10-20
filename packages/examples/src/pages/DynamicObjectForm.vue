<template>
  <FormProvider
    title="Dynamic Object Form"
    :form="form"
    class="form"
    @submit="handleSubmit()"
  >
    <template v-for="[key, field] in Object.entries(form)" :key="key">
      <div v-if="field">
        <label :for="key" class="form-label capitalize">{{ key }}</label>
        <div class="flex items-center">
          <input
            class="form-input"
            :class="{ error: field.$hasError }"
            type="text"
            v-model="field.$value"
            @blur="field.$validate()"
          />
          <MinusCircleIcon
            v-if="key !== 'a'"
            class="minus-circle ml-4"
            @click="removeField(key)"
          />
        </div>
        <FormErrors class="mt-2" :errors="field.$errors" />
      </div>
      <PlusCircleIcon v-else class="plus-circle" @click="addField(key)" />
    </template>
    <FormButtons class="mt-6" @reset="resetFields()" />
  </FormProvider>
</template>

<script setup lang="ts">
import { PlusCircleIcon, MinusCircleIcon } from '@heroicons/vue/outline'
import { Field, useValidation } from 'vue3-form-validation'

import FormProvider from '~/components/form/FormProvider.vue'
import FormButtons from '~/components/form/FormButtons.vue'
import FormErrors from '~/components/form/FormErrors.vue'
import { rules } from '~/domain'

type FormData = {
  a: Field<string>
  b?: Field<string>
  c?: Field<string>
}

const { form, validateFields, resetFields, add, remove } =
  useValidation<FormData>({
    a: {
      $value: '',
      $rules: [rules.required('Please enter some text for this field')]
    },
    b: undefined,
    c: undefined
  })

function addField(key: string) {
  add([key], {
    $value: '',
    $rules: [rules.required('Please enter some text for this field')]
  })
}

function removeField(key: string) {
  remove([key])
  add([key], undefined)
}

async function handleSubmit() {
  try {
    const formData = await validateFields({
      predicate: value => value !== undefined
    })
    console.log(formData)
  } catch (e) {
    console.log(e)
  }
}
</script>

<style lang="postcss" scoped>
:deep(.form) {
  @apply grid gap-y-4;
}
</style>
