<template>
  <h1 class="font-bold text-3xl mb-12">Dynamic Object Form</h1>
  <form autocomplete="off" @submit.prevent="handleSubmit()">
    <div>
      <label class="font-semibold mb-1 capitalize block" for="A">A</label>
      <VInput
        id="A"
        v-model="form.a.$value"
        :errors="form.a.$errors"
        class="border p-3 w-full rounded"
      />
    </div>
    <div class="my-12">
      <IconPlusCircle
        v-if="form.b === undefined"
        class="w-6 h-6 my-12 cursor-pointer text-blue-500 hover:text-blue-700"
        @click="addField('b')"
      />
      <template v-else>
        <label class="font-semibold mb-1 capitalize block" for="B">B</label>
        <VInput
          id="B"
          v-model="form.b.$value"
          :errors="form.b.$errors"
          class="border p-3 w-full rounded"
        />
        <IconMinusCircle
          class="w-6 h-6 mt-2 cursor-pointer text-red-500 hover:text-red-700"
          @click="removeField('b')"
        />
      </template>
    </div>
    <div>
      <IconPlusCircle
        v-if="form.c === undefined"
        class="w-6 h-6 my-12 cursor-pointer text-blue-500 hover:text-blue-700"
        @click="addField('c')"
      />
      <template v-else>
        <label class="font-semibold mb-1 capitalize block" for="C">C</label>
        <VInput
          id="C"
          v-model="form.c.$value"
          type="number"
          :errors="form.c.$errors"
          class="border p-3 w-full rounded"
        />
        <IconMinusCircle
          class="w-6 h-6 mt-2 cursor-pointer text-red-500 hover:text-red-700"
          @click="removeField('c')"
        />
      </template>
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
  <VPreFormData class="mt-20" :form="form" :errors="errors" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Field, useValidation, ValidationError } from '../../../main';
import VPreFormData from '../components/common/VPreFormData/VPreFormData.vue';
import VButton from '../components/common/VButton/VButton.vue';
import IconPlusCircle from '../components/icons/IconPlusCircle.vue';
import IconMinusCircle from '../components/icons/IconMinusCircle.vue';
import VInput from '../components/common/VInput/VInput.vue';

type FormData = {
  a: Field<string>;
  b?: Field<string>;
  c?: Field<number>;
};

export default defineComponent({
  components: {
    VButton,
    VPreFormData,
    IconPlusCircle,
    IconMinusCircle,
    VInput
  },
  setup() {
    const {
      form,
      errors,
      submitting,
      validateFields,
      resetFields,
      add,
      remove
    } = useValidation<FormData>({
      a: {
        $value: '',
        $rules: [a => !a && 'A is required']
      }
    });

    const addField = (key: 'b' | 'c') => {
      if (key === 'b') {
        add([key], {
          $value: 'B',
          $rules: [b => !b && 'B is required']
        });
      } else {
        add([key], {
          $value: 10,
          $rules: [c => c >= 5 || 'Please select a value greater than 4']
        });
      }
    };

    const removeField = (key: 'b' | 'c') => {
      remove([key]);
    };

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

    return {
      form,
      errors,
      submitting,
      handleSubmit,
      resetFields,
      addField,
      removeField
    };
  }
});
</script>

<style lang="postcss" scoped></style>
