<template>
  <h1 class="text-3xl font-bold mb-14">Text Binding</h1>
  <form @submit.prevent="handleSubmit">
    <div>
      <label for="text" class="block mb-1 font-semibold">Text</label>
      <input
        id="text"
        v-model="form.text.$value"
        class="border p-2"
        type="text"
        @blur="form.text.$onBlur()"
      />
    </div>
    <div class="flex mt-2">
      <div>
        <label for="password" class="block mb-1 font-semibold">Password</label>
        <input
          id="password"
          v-model="form.password.$value"
          class="border p-2"
          type="text"
          @blur="form.password.$onBlur()"
        />
      </div>
      <div class="ml-4">
        <label for="confirm-password" class="block mb-1 font-semibold">
          Confirm Password
        </label>
        <input
          id="confirm-password"
          v-model="form.confirmPassword.$value"
          class="border p-2"
          type="text"
          @blur="form.confirmPassword.$onBlur()"
        />
      </div>
    </div>

    <div class="flex mt-8">
      <VButton class="primary py-3 px-6" type="submit" :loading="submitting">
        Submit
      </VButton>
      <VButton class="secondary ml-4 py-3 px-6" @click="resetFields()">
        Reset
      </VButton>
    </div>
  </form>
  <VPreFormData class="mt-24" :form="form" :errors="errors" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useValidation, ValidationError } from '../../../main';
import type { Field } from '../../../main';
import { randomPromise } from '../utils';
import VPreFormData from '../components/common/VPreFormData/VPreFormData.vue';
import VButton from '../components/common/VButton/VButton.vue';

type FormData = {
  text: Field<string>;
  password: Field<string>;
  confirmPassword: Field<string>;
};

export default defineComponent({
  components: {
    VPreFormData,
    VButton
  },
  setup() {
    const password = ref('');
    const confirmPassword = ref('');

    const { form, errors, submitting, validateFields, resetFields } =
      useValidation<FormData>({
        text: {
          $value: '',
          $rules: [randomPromise]
        },
        password: {
          $value: password,
          $rules: [
            {
              key: 'pw',
              rule: () =>
                password.value === confirmPassword.value ||
                "Passwords don't match"
            }
          ]
        },
        confirmPassword: {
          $value: confirmPassword,
          $rules: [
            {
              key: 'pw',
              rule: () =>
                password.value === confirmPassword.value ||
                "Passwords don't match"
            }
          ]
        }
      });

    const handleSubmit = async () => {
      try {
        const formData = await validateFields();
        console.log(JSON.stringify(formData, null, 2));
      } catch (e) {
        if (e instanceof ValidationError) {
          console.log(e);
        }
      }
    };

    return { form, errors, submitting, handleSubmit, resetFields };
  }
});
</script>
