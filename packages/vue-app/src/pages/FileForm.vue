<template>
  <section>
    <form class="w-1/2 grid gap-y-6" @submit.prevent="handleSubmit">
      <div>
        <label for="text" class="block text-gray-700 mb-2 font-medium">
          Enter some Text
        </label>
        <input
          type="text"
          id="text"
          :class="[
            'text-sm block rounded-md border-gray-300 form-input',
            { error: form.text.$hasError }
          ]"
          v-on="form.text.$listener"
          v-model="form.text.$value"
          autocomplete="off"
        />
        <div class="text-red-500 text-sm mt-2" v-if="form.text.$hasError">
          <p v-for="error in form.text.$errors" :key="error">
            {{ error }}
          </p>
        </div>
      </div>
      <div>
        <input type="text" v-model="form.k1.$value" v-on="form.k1.$listener" />
        <input type="text" v-model="form.k2.$value" v-on="form.k2.$listener" />
      </div>
      <FormFileUpload
        label="Select some Files"
        v-model="form.files.$value"
        :errors="form.files.$errors"
        v-on="form.files.$listener"
        multiple
      >
      </FormFileUpload>
      <div>
        <BaseButton html-type="submit" class="px-4 py-2 rounded-md font-medium">
          Submit
        </BaseButton>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import FormFileUpload from '~/components/form/FormFileUpload.vue'
import BaseButton from '~/components/base/BaseButton.vue'
import { Field, useValidation } from 'vue3-form-validation'
import { min } from '~/domain'

interface FormData {
  files: Field<File[]>
  text: Field<string>
  k1: Field<string>
  k2: Field<string>
}

const { form, validateFields, add } = useValidation<FormData>({
  files: {
    $value: [],
    $rules: [min(1)('Please select one or more files')],
    $validationBehaviour: 'lazier'
  },
  text: {
    $value: '',
    $rules: [min(6)('Please enter text longer than 5 chracters')],
    $validationBehaviour: 'lazier'
  },
  k1: {
    $value: '',
    $rules: [
      {
        key: 'k',
        rule: () => {
          console.log('k1')
        }
      },
      {
        key: 'a',
        rule: () => {
          console.log('k1')
        }
      }
    ],
    $validationBehaviour: 'aggresive'
  },
  k2: {
    $value: '',
    $rules: [
      () => {
        console.log('k2')
      },
      {
        key: 'k',
        rule: () => {
          console.log('k2')
        }
      }
    ],
    $validationBehaviour: 'aggresive'
  }
})

async function handleSubmit() {
  try {
    const formData = await validateFields(['k2'])
    console.log(formData)
  } catch (e) {
    console.log(e)
  }
}
</script>
