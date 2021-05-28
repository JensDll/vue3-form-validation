<template>
  <h1 class="text-3xl font-bold mb-14">Text Binding</h1>
  <form autocomplete="off" @submit.prevent="handleSubmit">
    <div class="w-1/2">
      <label for="text" class="block mb-1 font-semibold">Text</label>
      <VInput
        id="text"
        v-model="form.text.$value"
        class="border p-3 w-full"
        type="text"
        :validating="form.text.$validating"
        :errors="form.text.$errors"
        @blur="form.text.$onBlur()"
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
      <VButton class="primary py-3 px-6" type="submit" :disabled="submitting">
        Submit
      </VButton>
      <VButton class="secondary ml-4 py-3 px-6" @click="resetFields()">
        Reset
      </VButton>
    </div>
  </form>
  <VPreFormData class="mt-24" :form="form" :errors="errors" />
</template>

<script>
import { defineComponent } from 'vue';
import { useValidation, ValidationError } from '../../../main';
import { randomPromise } from '../utils';
import VPreFormData from '../components/common/VPreFormData/VPreFormData.vue';
import VButton from '../components/common/VButton/VButton.vue';
import VInput from '../components/common/VInput/VInput.vue';

export default defineComponent({
  components: {
    VPreFormData,
    VButton,
    VInput
  },
  setup() {
    const { form, errors, submitting, validateFields, resetFields } =
      useValidation({
        text: {
          $value: '',
          $rules: [text => !text && 'Text is required', randomPromise]
        },
        password: {
          $value: 10,
          $rules: [
            {
              key: 'pw',
              rule: (password, confirmPassword) =>
                password === confirmPassword || "Passwords don't match"
            }
          ]
        },
        confirmPassword: {
          $value: '',
          $rules: [
            {
              key: 'pw',
              rule: (password, confirmPassword) =>
                password === confirmPassword || "Passwords don't match"
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
