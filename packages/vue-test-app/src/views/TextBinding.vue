<template>
  <h1 class="text-3xl font-bold mb-14">Text Binding</h1>
  <form autocomplete="off" @submit.prevent="handleSubmit">
    <div class="w-1/2">
      <label for="text" class="block mb-1 font-semibold">Name</label>
      <VInput
        id="text"
        v-model="form.name.$value"
        class="border p-3 w-full"
        type="text"
        :validating="form.name.$validating"
        :errors="form.name.$errors"
        @blur="form.name.$onBlur()"
      />
    </div>
    <div class="flex mt-2">
      <div>
        <label for="password" class="block mb-1 font-semibold">Password</label>
        <VInput
          id="password"
          v-model="form.password.$value"
          class="border p-3"
          type="text"
          :errors="form.password.$errors"
          @blur="form.password.$onBlur()"
        />
      </div>
      <div class="ml-4">
        <label for="confirm-password" class="block mb-1 font-semibold">
          Confirm Password
        </label>
        <VInput
          id="confirm-password"
          v-model="form.confirmPassword.$value"
          class="border p-3"
          type="text"
          :errors="form.confirmPassword.$errors"
          @blur="form.confirmPassword.$onBlur()"
        />
      </div>
    </div>
    <div class="flex mt-8">
      <VButton
        class="py-3 px-6"
        html-type="submit"
        type="primary"
        :disabled="submitting"
      >
        Submit
      </VButton>
      <VButton class="ml-4 py-3 px-6" type="secondary" @click="resetFields()">
        Reset
      </VButton>
    </div>
  </form>
  <VPreFormData class="mt-24" :form="form" :errors="errors" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useValidation, ValidationError, Field } from 'vue3-form-validation';
import { randomPromise, required, min, equal } from '../utils';
import VPreFormData from '../components/common/VPreFormData/VPreFormData.vue';
import VButton from '../components/common/VButton/VButton.vue';
import VInput from '../components/common/VInput/VInput.vue';

type FormData = {
  name: Field<string>;
  password: Field<string>;
  confirmPassword: Field<string>;
};

export default defineComponent({
  components: {
    VPreFormData,
    VButton,
    VInput
  },
  setup() {
    const { form, errors, submitting, validateFields, resetFields } =
      useValidation<FormData>({
        name: {
          $value: '',
          $rules: [required('Name is required'), randomPromise]
        },
        password: {
          $value: '',
          $rules: [
            min(7)('Password has to be longer than 7 characters'),
            {
              key: 'pw',
              rule: equal('Passwords do not match')
            }
          ]
        },
        confirmPassword: {
          $value: '',
          $rules: [
            min(7)('Password has to be longer than 7 characters'),
            {
              key: 'pw',
              rule: equal('Passwords do not match')
            }
          ]
        }
      });

    const handleSubmit = async () => {
      try {
        const formData = await validateFields([]);
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
