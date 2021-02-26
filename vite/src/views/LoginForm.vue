<template>
  <h1>Login Form</h1>
  <form class="form mb-8 mt-10" @submit.prevent="handleSubmit()">
    <BaseInput
      v-model="form.name.$value"
      class="name"
      label="Name"
      :errors="form.name.$errors"
      :validating="form.name.$validating"
      @blur="form.name.$onBlur()"
    />
    <BaseInput
      v-model="form.email.$value"
      class="mail"
      label="E-Mail"
      :errors="form.email.$errors"
      @blur="form.email.$onBlur()"
    />
    <BaseInput
      v-model="form.password.$value"
      class="password"
      label="Password"
      type="password"
      :errors="form.password.$errors"
      @blur="form.password.$onBlur()"
    />
    <BaseInput
      v-model="form.repeatPassword.$value"
      class="repeat-password"
      label="Repeat password"
      type="password"
      :errors="form.repeatPassword.$errors"
      @blur="form.repeatPassword.$onBlur()"
    />
    <BaseButton
      class="mt-8 py-3"
      type="primary"
      html-type="submit"
      :disabled="submitting"
    >
      Login
    </BaseButton>
    <BaseButton class="mt-8 py-3" @click="resetFields">Reset</BaseButton>
  </form>
  <PreFormData :form="form" :errors="errors" />
</template>

<script lang="ts">
import BaseInput from '../components/BaseInput.vue';
import BaseButton from '../components/BaseButton.vue';
import PreFormData from '../components/PreFormData.vue';

import { defineComponent, ref } from 'vue';
import { useValidation, Field } from '../../../main';

interface FormData {
  name: Field<string>;
  email: Field<string>;
  password: Field<string>;
  repeatPassword: Field<string>;
}

export default defineComponent({
  components: { BaseButton, BaseInput, PreFormData },
  setup() {
    const password = ref('');
    const repeatPassword = ref('');

    const {
      form,
      validateFields,
      errors,
      resetFields,
      submitting
    } = useValidation<FormData>({
      name: {
        $value: '',
        $rules: [
          name => !name && 'Name is required',
          name => name.length > 2 || 'Name has to be longer than 2 characters',
          name =>
            new Promise<string | void>(resolve => {
              setTimeout(() => {
                if (['alice', 'bob', 'oscar'].includes(name.toLowerCase())) {
                  resolve();
                } else {
                  // Resolve or reject with string
                  resolve('This name is already taken');
                }
              }, 2000);
            })
        ]
      },
      email: {
        $value: '',
        $rules: [
          email => {
            const regex = /\S+@\S+\.\S+/;
            if (!regex.test(email)) {
              return 'Please enter a valid email address';
            }
          }
        ]
      },
      password: {
        $value: password,
        $rules: [
          pw => pw.length > 7 || 'Password has to be longer than 7 characters',
          {
            key: 'pw',
            rule: () =>
              password.value === repeatPassword.value || "Passwords don't match"
          }
        ]
      },
      repeatPassword: {
        $value: repeatPassword,
        $rules: [
          pw => pw.length > 7 || 'Password has to be longer than 7 characters',
          {
            key: 'pw',
            rule: () =>
              password.value === repeatPassword.value || "Passwords don't match"
          }
        ]
      }
    });

    const handleSubmit = () => {
      validateFields()
        .then(formData => {
          console.log(JSON.stringify(formData, null, 2));
        })
        .catch(() => {
          // validation error
        });
    };

    return {
      form,
      handleSubmit,
      submitting,
      errors,
      resetFields
    };
  },
  computed: {
    formJSON(): string {
      return JSON.stringify(
        this.form,
        (k, v) => (typeof v === 'function' ? 'function' : v),
        2
      );
    }
  }
});
</script>

<style scoped>
.form {
  display: grid;
  column-gap: 25px;
  row-gap: 10px;
  grid-template-columns: 1fr 1fr;
  grid-template-areas:
    'name email'
    'password password'
    'repeatPassword repeatPassword';
}

.name {
  grid-area: name;
}

.e-mail {
  grid-area: email;
}

.password {
  grid-area: password;
}

.repeat-password {
  grid-area: repeatPassword;
}
</style>
