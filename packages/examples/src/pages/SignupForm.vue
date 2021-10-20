<template>
  <FormProvider
    class="form"
    title="Signup Form"
    :form="form"
    @submit="handleSubmit()"
  >
    <div class="name">
      <label for="name" class="form-label">Name</label>
      <div class="relative flex items-center input-a">
        <LoadingIcon
          v-show="form.name.$validating"
          class="w-5 h-5 absolute right-4 text-indigo-600"
          :class="{ '!text-red-500': form.name.$hasError }"
          spin
        />
        <input
          id="name"
          :class="['text-sm form-input w-full', { error: form.name.$hasError }]"
          type="text"
          placeholder="Alice, Bob or Oscar"
          @blur="form.name.$validate()"
          v-model="form.name.$value"
        />
      </div>
      <FormErrors :errors="form.name.$errors" class="mt-2" />
    </div>
    <div class="email">
      <label for="email" class="form-label">Email</label>
      <input
        id="email"
        :class="['text-sm form-input w-full', { error: form.email.$hasError }]"
        type="email"
        v-model="form.email.$value"
        @blur="form.email.$validate()"
      />
      <FormErrors :errors="form.email.$errors" class="mt-2" />
    </div>
    <div class="password">
      <label for="password" class="form-label">Password</label>
      <input
        id="password"
        :class="[
          'text-sm form-input w-full',
          { error: form.password.$hasError }
        ]"
        type="password"
        v-model="form.password.$value"
        @blur="form.password.$validate()"
      />
      <FormErrors :errors="form.password.$errors" class="mt-2" />
    </div>
    <div class="confirm-password">
      <label for="confirm-password" class="form-label">Confirm Password</label>
      <input
        id="confirm-password"
        :class="[
          'text-sm form-input w-full',
          { error: form.confirmPassword.$hasError }
        ]"
        type="password"
        v-model="form.confirmPassword.$value"
        @blur="form.confirmPassword.$validate()"
      />
      <FormErrors :errors="form.confirmPassword.$errors" class="mt-2" />
    </div>
    <FormButtons
      class="col-span-full mt-6"
      :submitting="submitting"
      @reset="resetFields()"
    />
  </FormProvider>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Field, useValidation } from 'vue3-form-validation'

import FormProvider from '~/components/form/FormProvider.vue'
import FormErrors from '~/components/form/FormErrors.vue'
import FormButtons from '~/components/form/FormButtons.vue'
import LoadingIcon from '~/components/icon/LoadingIcon.vue'
import { rules } from '~/domain'

interface FormData {
  name: Field<any>
  email: Field<string>
  password: Field<string>
  confirmPassword: Field<string>
}

const { form, submitting, validateFields, resetFields } =
  useValidation<FormData>({
    name: {
      $value: '',
      $rules: [
        rules.required('Please enter your name'),
        [
          'change',
          (name: string) =>
            new Promise<void | string>(resolve => {
              setTimeout(() => {
                if (['alice', 'bob', 'oscar'].includes(name.toLowerCase())) {
                  resolve()
                } else {
                  resolve(`Name '${name}' is not available`)
                }
              }, 600)
            }),
          200
        ]
      ]
    },
    email: {
      $value: '',
      $rules: [rules.email('Please enter a valid email address')]
    },
    password: {
      $value: '',
      $rules: [
        rules.min(5)('Password has to be longer than 5 characters'),
        [
          'lazy',
          {
            key: 'pw',
            rule: rules.equal('Password do not match')
          }
        ]
      ]
    },
    confirmPassword: {
      $value: '',
      $rules: [
        rules.min(5)('Password has to be longer than 5 characters'),
        [
          'lazy',
          {
            key: 'pw',
            rule: rules.equal('Password do not match')
          }
        ]
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
  @apply grid max-w-2xl gap-x-8 gap-y-6;
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
