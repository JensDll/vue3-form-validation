<template>
  <h1>Async Form Loading</h1>
  <form class="mb-8 mt-10" @submit.prevent="handleSubmit">
    <BaseInput
      v-model="form.amount.$value"
      label="Recipe"
      type="number"
      :placeholder="loading ? 'Loading ...' : null"
      :disabled="loading"
      :validating="form.amount.$validating || loading"
      @blur="form.amount.$onBlur"
    />
    <fieldset>
      <label>
        <div>Mastercard</div>
        <input
          v-model="form.paymentMethod.$value"
          type="radio"
          value="mastercard"
        />
      </label>
      <label>
        <div>Visa</div>
        <input v-model="form.paymentMethod.$value" type="radio" value="visa" />
      </label>
      <label>
        <div>American Express</div>
        <input
          v-model="form.paymentMethod.$value"
          type="radio"
          value="merican-express"
        />
      </label>
    </fieldset>
    <div class="flex mt-4">
      <BaseButton
        class="mr-2 py-1"
        type="primary"
        html-type="submit"
        :disabled="submitting"
      >
        Submit
      </BaseButton>
      <BaseButton class="py-1" @click="resetFields()">Reset</BaseButton>
    </div>
  </form>
  <PreFormData :form="form" :errors="errors" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useValidation, Field } from '../../../main';
import PreFormData from '../components/PreFormData.vue';
import BaseInput from '../components/BaseInput.vue';
import BaseButton from '../components/BaseButton.vue';

const sleep = (ms: number) =>
  new Promise<void>(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });

type FormData = {
  amount: Field<number>;
  paymentMethod: Field<string>;
};

export default defineComponent({
  components: {
    PreFormData,
    BaseInput,
    BaseButton
  },
  setup() {
    const loading = ref(false);
    const {
      form,
      errors,
      submitting,
      validateFields,
      resetFields
    } = useValidation<FormData>({
      amount: {
        $value: 0
      },
      paymentMethod: {
        $value: ''
      }
    });

    (async function () {
      loading.value = true;
      await sleep(1500);
      resetFields({
        amount: 100,
        paymentMethod: 'visa'
      });
      loading.value = false;
    })();

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
      errors,
      submitting,
      loading,
      handleSubmit,
      resetFields
    };
  }
});
</script>

<style></style>
