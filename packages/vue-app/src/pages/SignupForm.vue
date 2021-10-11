<template>
  <FormProvider
    title="Signup Form"
    class="form"
    :form="form"
    @submit="handleSubmit"
    @reset="resetFields()"
  >
    <div class="name">
      <label for="name" class="form-label">Name</label>
      <input
        type="text"
        id="name"
        :class="['text-sm form-input w-full', { error: form.name.$hasError }]"
        v-model="form.name.$value"
        @blur="form.name.$setTouched()"
      />
      <FormErrors :errors="form.name.$errors" class="mt-2" />
    </div>
    <div class="email">
      <label for="email" class="form-label">Email</label>
      <input
        type="email"
        id="email"
        :class="['text-sm form-input w-full', { error: form.email.$hasError }]"
        v-model="form.email.$value"
        @blur="form.email.$setTouched()"
      />
      <FormErrors :errors="form.email.$errors" class="mt-2" />
    </div>
    <div class="password">
      <label for="password" class="form-label">Password</label>
      <input
        type="password"
        id="password"
        :class="[
          'text-sm form-input w-full',
          { error: form.password.$hasError }
        ]"
        v-model="form.password.$value"
        @blur="form.password.$setTouched()"
      />
      <FormErrors :errors="form.password.$errors" class="mt-2" />
    </div>
    <div class="confirm-password">
      <label for="confirm-password" class="form-label">Confirm Password</label>
      <input
        type="password"
        id="confirm-password"
        :class="[
          'text-sm form-input w-full',
          { error: form.confirmPassword.$hasError }
        ]"
        v-model="form.confirmPassword.$value"
        @blur="form.confirmPassword.$setTouched()"
      />
      <FormErrors :errors="form.confirmPassword.$errors" class="mt-2" />
    </div>
    <FormButtons
      :submitting="submitting"
      @reset="resetFields()"
      class="col-span-full mt-4"
    />
  </FormProvider>
</template>

<script setup lang="ts">
import { Field, useValidation } from 'vue3-form-validation'
import { rules } from '~/domain'
import FormProvider from '~/components/layout/FormProvider.vue'
import FormErrors from '~/components/form/FormErrors.vue'
import FormButtons from './components/FormButtons.vue'

interface FormData {
  name: Field<string>
  email: Field<string>
  password: Field<string>
  confirmPassword: Field<string>
}

const { form, submitting, validateFields, resetFields } =
  useValidation<FormData>({
    name: {
      $value: '',
      $rules: [rules.required('Please select a name')]
    },
    email: {
      $value: '',
      $rules: [rules.email('Please select a valid email address')]
    },
    password: {
      $value: '',
      $rules: [
        rules.min(5)('Password has to be longer than 5 characters'),
        {
          key: 'pw',
          rule: rules.equal('Password do not match')
        }
      ]
    },
    confirmPassword: {
      $value: '',
      $rules: [
        rules.min(5)('Password has to be longer than 5 characters'),
        {
          key: 'pw',
          rule: rules.equal('Password do not match')
        }
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

<style lang="postcss" scoped>
:deep(.form) {
  @apply grid max-w-2xl gap-x-8 gap-y-4;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto auto;
  grid-template-areas:
    'name email'
    'password password'
    'confirm-password confirm-password';
}

.name {
  grid-area: name;
}

.email {
  grid-area: email;
}

.password {
  grid-area: password;
}

.confirm-password {
  grid-area: confirm-password;
}
</style>
