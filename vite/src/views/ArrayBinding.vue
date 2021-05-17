<template>
  <h1 class="text-3xl font-bold mb-12">Array Binding</h1>
  <form @submit.prevent="handleSubmit()">
    <label>
      <div class="font-semibold mb-1">Select Binding</div>
      <select v-model="form.coloursSelect.$value" class="border" multiple>
        <option v-for="colour in colours" :key="colour" :value="colour">
          {{ colour }}
        </option>
      </select>
    </label>
    <div class="font-semibold mb-1 mt-2">Checkbox Binding</div>
    <div v-for="colour in colours" :key="colour">
      <label>
        <input
          v-model="form.coloursCheckbox.$value"
          type="checkbox"
          :value="colour"
        />
        {{ colour }}
      </label>
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
  <VPreFormData class="mt-20" :form="form" :errors="errors" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useValidation, ValidationError, Field } from '../../../main';
import VPreFormData from '../components/common/VPreFormData/VPreFormData.vue';
import VButton from '../components/common/VButton/VButton.vue';

type FormData = {
  coloursSelect: Field<string[]>;
  coloursCheckbox: Field<string[]>;
};

export default defineComponent({
  components: {
    VPreFormData,
    VButton
  },
  setup() {
    const { form, errors, submitting, validateFields, resetFields } =
      useValidation<FormData>({
        coloursSelect: {
          $value: [],
          $rules: [
            coloursSelect =>
              coloursSelect.length >= 2 || 'Select atleast two colours'
          ]
        },
        coloursCheckbox: {
          $value: [],
          $rules: [
            coloursCheckbox =>
              coloursCheckbox.length >= 3 || 'Select atleast three colours'
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
  },
  data() {
    return {
      colours: ['Red', 'Green', 'Blue', 'Yellow', 'Black']
    };
  }
});
</script>
