<template>
  <FormProvider
    :form="form"
    :errors="errors"
    title="Register Form"
    @submit="handleSubmit()"
  >
    <div class="container">
      <div class="name">
        <label :for="form.name.$uid" class="form-label">Name</label>
        <BaseInput
          :id="form.name.$uid"
          v-model="form.name.$value"
          :has-error="form.name.$hasError"
          :validating="form.name.$validating"
          placeholder="Alice, Bob, Oscar"
          @blur="form.name.$onBlur()"
        />
        <ValidationErrors
          class="validation-errros"
          :errors="form.name.$errors"
        />
      </div>
      <div class="email">
        <label :for="form.email.$uid" class="form-label">Email address</label>
        <BaseInput
          :id="form.email.$uid"
          v-model="form.email.$value"
          :has-error="form.email.$hasError"
          label="Email address"
          @blur="form.email.$onBlur()"
        />
        <ValidationErrors :errors="form.email.$errors" />
      </div>
      <div class="password">
        <label :for="form.password.$uid" class="form-label">Password</label>
        <BaseInput
          :id="form.password.$uid"
          v-model="form.password.$value"
          :has-error="form.password.$hasError"
          type="password"
          @blur="form.password.$onBlur()"
        />
        <ValidationErrors :errors="form.password.$errors" />
      </div>
      <div class="confirm-password">
        <label :for="form.confirmPassword.$uid" class="form-label">
          Confirm Password
        </label>
        <BaseInput
          :id="form.confirmPassword.$uid"
          v-model="form.confirmPassword.$value"
          :has-error="form.confirmPassword.$hasError"
          type="password"
          @blur="form.confirmPassword.$onBlur()"
        />
        <ValidationErrors :errors="form.confirmPassword.$errors" />
      </div>
      <SubmitButtons
        class="buttons"
        gap="2rem"
        :submitting="submitting"
        @reset="resetFields()"
      />
    </div>
  </FormProvider>
</template>

<script>
import { defineComponent } from 'vue';
import { required, min, email, equal } from '../utils';
import { useValidation, ValidationError } from 'vue3-form-validation';

import FormProvider from '../components/FormProvider.vue';
import SubmitButtons from '../components/SubmitButtons.vue';
import BaseInput from '../components/BaseInput.vue';
import ValidationErrors from '../components/ValidationErrors.vue';
import { promise } from '../utils/rules';

export default defineComponent({
  components: {
    FormProvider,
    SubmitButtons,
    BaseInput,
    ValidationErrors
  },
  setup() {
    const { form, errors, submitting, validateFields, resetFields } =
      useValidation({
        name: {
          $value: '',
          $rules: [
            required('Name is required'),
            min(3)('Name has to be longer than 2 characters'),
            name =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  if (['alice', 'bob', 'oscar'].includes(name.toLowerCase())) {
                    resolve();
                  } else {
                    // Resolve or reject with a string
                    reject('This name is already taken');
                  }
                }, 2000);
              }),
            promise(3000)
          ]
        },
        email: {
          $value: '',
          $rules: [email('Please enter a valid email address')]
        },
        password: {
          $value: '',
          $rules: [
            min(8)('Password has to be longer than 7 characters'),
            {
              key: 'pw',
              rule: equal('Passwords do not match')
            }
          ]
        },
        confirmPassword: {
          $value: '',
          $rules: [
            min(8)('Password has to be longer than 7 characters'),
            {
              key: 'pw',
              rule: equal('Passwords do not match')
            }
          ]
        }
      });

    const handleSubmit = async () => {
      try {
        const formData = await validateFields();
        console.log(formData);
      } catch (e) {
        if (e instanceof ValidationError) {
          console.log(e.message);
        }
      }
    };

    return {
      form,
      errors,
      submitting,
      resetFields,
      handleSubmit
    };
  }
});
</script>

<style scoped>
.container {
  display: grid;
  column-gap: 2rem;
  row-gap: 1rem;
  grid-template-columns: 1fr 1fr;
  grid-template-areas:
    'name email'
    'password password'
    'confirm-password confirm-password'
    'buttons buttons';
}

.buttons {
  margin-top: 1.25rem;
  grid-area: buttons;
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
