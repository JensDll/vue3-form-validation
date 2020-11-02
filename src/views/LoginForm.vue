<template>
  <BaseForm @submit="onSubmit" class="form" v-slot="{ submitting }">
    <BaseInput
      class="name"
      label="Name"
      autocomplete="off"
      v-model="formData.name"
      :rules="[
        async value => !value && 'Name is required',
        async value =>
          value.length > 2 || 'Name has to be longer than 2 characters',
        nameRule
      ]"
    />
    <BaseInput
      class="e-mail"
      label="E-Mail"
      autocomplete="off"
      v-model="formData.mail"
      :rules="[async value => !value && 'E-Mail is required']"
    />
    <BaseInput
      class="password"
      label="Password"
      autocomplete="off"
      type="password"
      v-model="formData.password"
      :rules="[
        async value =>
          value.length > 7 || 'Password has to be longer than 7 characters',
        {
          key: 'pw',
          rule: async () =>
            formData.password === formData.repeatPassword ||
            'Passwords don\'t match'
        }
      ]"
    />
    <BaseInput
      class="repeat-password"
      label="Repeat password"
      autocomplete="off"
      type="password"
      v-model="formData.repeatPassword"
      :rules="[
        async value =>
          value.length > 7 || 'Password has to be longer than 7 characters',
        {
          key: 'pw',
          rule: async () =>
            formData.password === formData.repeatPassword ||
            'Passwords don\'t match'
        }
      ]"
    />
    <BaseButton
      class="mt-5"
      type="primary"
      htmlType="submit"
      :disabled="submitting"
    >
      Login
    </BaseButton>
    <BaseButton class="mt-5">Cancel</BaseButton>
  </BaseForm>
</template>

<script lang="ts">
import BaseInput from '../components/form/BaseInput.vue';
import BaseForm from '../components/form/BaseForm.vue';
import BaseButton from '../components/BaseButton.vue';
import { defineComponent, reactive, ref } from 'vue';

export default defineComponent({
  components: { BaseInput, BaseForm, BaseButton },
  setup() {
    const formData = reactive({
      name: '',
      mail: '',
      password: '',
      repeatPassword: ''
    });

    return {
      formData
    };
  },
  methods: {
    onSubmit() {
      alert(JSON.stringify(this.formData, null, 2));
    },
    async nameRule(name: string) {
      return new Promise(resolve => {
        setTimeout(() => {
          if (['foo'].includes(name)) {
            resolve();
          } else {
            resolve('This name is already taken');
          }
        }, 1000);
      });
    }
  }
});
</script>

<style scoped>
.form {
  width: 50%;
  display: grid;
  column-gap: 25px;
  row-gap: 8px;
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
