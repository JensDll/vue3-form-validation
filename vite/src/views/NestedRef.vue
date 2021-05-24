<template>
  <h1 class="text-3xl font-bold mb-14">Nested Ref</h1>
  <form autocomplete="off" @submit.prevent="handleSubmit">
    <div class="w-1/2">
      <label for="text" class="block mb-1 font-semibold">Text</label>
      <VInput
        id="text"
        v-model="form.a.$value[0]"
        class="border p-3 w-full"
        type="text"
        @blur="form.a.$onBlur()"
      />
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

<script lang="ts">
import { defineComponent } from 'vue';
import { useValidation, ValidationError } from '../../../main';
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
        a: {
          $value: ['']
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
