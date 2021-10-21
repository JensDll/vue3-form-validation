<script setup lang="ts">
import { Field, useValidation } from 'vue3-form-validation'

import FormProvider from '~/components/form/FormProvider.vue'
import FormButtons from '~/components/form/FormButtons.vue'
import FormInput from '~/components/form/FormInput.vue'
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
        [
          'change',
          (name: string) => {
            if (name.length === 0) {
              return 'Please enter your name'
            }

            return new Promise<void | string>(resolve => {
              setTimeout(() => {
                if (['alice', 'bob', 'oscar'].includes(name.toLowerCase())) {
                  resolve()
                } else {
                  resolve(`Name '${name}' is not available`)
                }
              }, 1500)
            })
          },
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

<template>
  <FormProvider title="Signup Form" class="form" @submit="handleSubmit()">
    <div class="name">
      <FormInput
        placeholder="Alice, Bob or Oscar"
        :label="{ value: 'Name', for: 'name' }"
        :errors="form.name.$errors"
        :validating="form.name.$validating"
        v-model="form.name.$value"
        @blur="form.name.$validate()"
      />
    </div>
    <div class="email">
      <FormInput
        :label="{ value: 'Email', for: 'email' }"
        :errors="form.email.$errors"
        v-model="form.email.$value"
        @blur="form.email.$validate()"
      />
    </div>
    <div class="password">
      <FormInput
        :label="{ value: 'Password', for: 'password' }"
        :errors="form.password.$errors"
        v-model="form.password.$value"
        @blur="form.password.$validate()"
      />
    </div>
    <div class="confirm-password">
      <FormInput
        :label="{ value: 'Confirm Password', for: 'confirm-password' }"
        :errors="form.confirmPassword.$errors"
        v-model="form.confirmPassword.$value"
        @blur="form.confirmPassword.$validate()"
      />
    </div>
    <FormButtons
      class="col-span-full mt-6"
      :submitting="submitting"
      @reset="resetFields()"
    />
  </FormProvider>
</template>

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
