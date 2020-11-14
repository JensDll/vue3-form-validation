<template>
  <h1 class="font-semibold text-2xl">Login</h1>
  <form class="form my-8" @submit.prevent="handleSubmit()">
    <BaseInput
      class="name input-error"
      label="Name"
      :errors="form.name.$errors"
      v-model="form.name.$value"
      @blur="form.name.$onBlur()"
    />
    <BaseInput
      class="mail"
      label="E-Mail"
      :errors="form.email.$errors"
      v-model="form.email.$value"
      @blur="form.email.$onBlur()"
    />
    <BaseInput
      class="password"
      label="Password"
      type="password"
      :errors="form.password.$errors"
      v-model="form.password.$value"
      @blur="form.password.$onBlur()"
    />
    <BaseInput
      class="repeat-password"
      label="Repeat password"
      type="password"
      :errors="form.repeatPassword.$errors"
      v-model="form.repeatPassword.$value"
      @blur="form.repeatPassword.$onBlur()"
    />
    <BaseButton
      class="mt-8"
      type="primary"
      htmlType="submit"
      :disabled="submitting"
    >
      Login
    </BaseButton>
    <BaseButton class="mt-8">Cancel</BaseButton>
  </form>
  <pre>{{ form }}</pre>
</template>

<script lang="ts">
import BaseInput from '../components/form/BaseInput.vue';
import BaseButton from '../components/BaseButton.vue';
import { defineComponent, markRaw, reactive, ref, watch } from 'vue';
import { useValidation, Field } from '../../main/composable/useValidation';

interface FormData {
  name: Field<string>;
  email: Field<string>;
  password: Field<string>;
  repeatPassword: Field<string>;
}

export default defineComponent({
  components: { BaseButton, BaseInput },
  setup() {
    const password = ref('');
    const repeatPassword = ref('');
    const submitting = ref(false);

    const { form, onSubmit } = useValidation<FormData>({
      name: {
        $value: '',
        $rules: [
          name => !name && 'Name is required',
          name => name.length > 2 || 'Name has to be longer than 2 characters',
          name =>
            new Promise(resolve => {
              setTimeout(() => {
                if (['Jens', 'foo', 'bar'].includes(name)) {
                  resolve();
                } else {
                  resolve('This name is already taken');
                }
              }, 2000);
            })
        ]
      },
      email: {
        $value: '',
        $rules: [email => !email && 'E-Mail is required']
      },
      password: {
        $value: password,
        $rules: [
          pw => pw.length > 7 || 'Password has to be longer than 7 characters',
          {
            key: 'pw',
            rule: () =>
              password.value === repeatPassword.value ||
              "Passwords dont't match"
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
              password.value === repeatPassword.value ||
              "Passwords dont't match"
          }
        ]
      }
    });

    const handleSubmit = () => {
      submitting.value = true;
      onSubmit(
        formData => {
          console.log(JSON.stringify(formData, null, 2));
          submitting.value = false;
        },
        () => {
          submitting.value = false;
        }
      );
    };

    return {
      form,
      handleSubmit,
      submitting
    };
  }
});
</script>

<style scoped>
.form {
  max-width: 900px;
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
