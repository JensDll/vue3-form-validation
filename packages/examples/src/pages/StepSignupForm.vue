<template>
  <FormProvider title="Step Signup Form" class="form lg:w-3/4">
    <label for="email" class="form-label email-label">Enter your Email</label>
    <input
      id="email"
      type="email"
      class="form-input email-input"
      v-model="form.email.$value"
      @blur="form.email.$touched = true"
    />
    <BaseButton
      outline
      :disabled="
        !form.email.$dirty || !form.email.$touched || form.email.$hasError
      "
      class="email-continue"
      @click="stepPassword = true"
    >
      Continue
    </BaseButton>
    <FormErrors :errors="new Set(['error'])" class="email-errors"></FormErrors>
    <template v-if="stepPassword">
      <label for="password" class="form-label password-label">
        Enter your Password
      </label>
      <label for="confirm-password" class="form-label confirm-password-label">
        Confirm Password
      </label>
      <input
        type="password"
        class="form-input password-input"
        v-model="form.password.$value"
      />
      <input
        type="password"
        class="form-input confirm-password-input"
        v-model="form.confirmPassword.$value"
      />
      <FormErrors :errors="['test']" class="password-errors" />
      <FormErrors :errors="['test']" class="confirm-password-errors" />
      <BaseButton outline class="password-continue" @click="stepName = true">
        Continue
      </BaseButton>
    </template>
    <template v-if="stepName">
      <label for="name" class="form-label name-label">Enter your Name</label>
      <input type="text" class="form-input name-input" />
      <FormErrors :errors="['error']" class="name-errors" />
    </template>
    <BaseButton
      html-type="submit"
      class="font-medium rounded-md px-16 mt-6 py-2 justify-self-start"
    >
      Signup
    </BaseButton>
  </FormProvider>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Field, useValidation } from 'vue3-form-validation'

import FormProvider from '~/components/form/FormProvider.vue'
import BaseButton from '~/components/base/BaseButton.vue'
import FormErrors from '~/components/form/FormErrors.vue'
import { rules } from '~/domain'

type FormData = {
  email: Field<string>
  password: Field<string>
  confirmPassword: Field<string>
  name: Field<string>
}

const stepPassword = ref(true)
const stepName = ref(true)

const { form } = useValidation<FormData>({
  email: {
    $value: '',
    $rules: [
      ['aggresive', rules.email('Email is invalid or taken')],
      [
        'aggresive',
        email =>
          new Promise<void | string>(resolve => {
            setTimeout(() => {
              if (email === 'test@test.com') {
                resolve()
              } else {
                resolve('Email is invalid or taken')
              }
            })
          }),
        200
      ]
    ]
  },
  password: {
    $value: ''
  },
  confirmPassword: {
    $value: ''
  },
  name: {
    $value: ''
  }
})
</script>

<style lang="postcss" scoped>
:deep(.form) {
  @apply grid;
  align-items: center;
  grid-template-columns: 1fr;
  grid-template-areas:
    'email-label'
    'email-input'
    'email-errors'
    'email-continue'
    'password-label'
    'password-input'
    'password-errors'
    'confirm-password-label'
    'confirm-password-input'
    'confirm-password-errors'
    'password-continue'
    'name-label'
    'name-input'
    'name-errors';

  /* Email */
  & .email-label {
    grid-area: email-label;
  }

  & .email-input {
    grid-area: email-input;
  }

  & .email-errors {
    @apply mt-2;
    grid-area: email-errors;
  }

  & .email-continue {
    @apply font-medium px-3 rounded-md justify-self-start mt-4 mb-8;
    grid-area: email-continue;
  }

  /* Password  */
  & .password-label {
    grid-area: password-label;
  }

  & .password-input {
    grid-area: password-input;
  }

  & .password-errors {
    @apply mt-2;
    grid-area: password-errors;
  }

  & .confirm-password-label {
    @apply mt-2;
    grid-area: confirm-password-label;
  }
  & .confirm-password-input {
    grid-area: confirm-password-input;
  }

  & .confirm-password-errors {
    @apply mt-2;
    grid-area: confirm-password-errors;
  }

  & .password-continue {
    @apply font-medium px-3 rounded-md justify-self-start mt-4 mb-8;
    grid-area: password-continue;
  }

  /* Name */
  & .name-label {
    grid-area: name-label;
  }

  & .name-input {
    grid-area: name-input;
  }

  & .name-errors {
    @apply mt-2;
    grid-area: name-errors;
  }
}

@screen lg {
  :deep(.form) {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      'email-label .'
      'email-input email-continue'
      'email-errors .'
      'password-label confirm-password-label'
      'password-input confirm-password-input'
      'password-errors confirm-password-errors'
      'password-continue .'
      'name-label .'
      'name-input .'
      'name-errors .';

    & * {
      @apply m-0;
    }
  }
}
</style>
