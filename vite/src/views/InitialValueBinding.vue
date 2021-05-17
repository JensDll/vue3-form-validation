<template>
  <h1 class="text-3xl font-bold mb-14">Async Initial Values</h1>
  <form @submit.prevent="handleSubmit">
    <div class="flex">
      <div>
        <label for="A" class="block mb-1 font-semibold">A</label>
        <input
          id="A"
          v-model="form.a.$value"
          :disabled="loading"
          class="border p-2"
          type="text"
          @blur="form.a.$onBlur()"
        />
      </div>
      <div class="ml-4">
        <label for="B" class="block mb-1 font-semibold">B</label>
        <input
          id="B"
          v-model="form.b.$value"
          :disabled="loading"
          class="border p-2 w-20"
          type="number"
          @blur="form.b.$onBlur()"
        />
      </div>
    </div>
    <div class="mt-2">
      <label for="C" class="block mb-1 font-semibold">C</label>
      <input
        id="C"
        v-model="form.c.$value.x.y.z"
        :disabled="loading"
        class="border p-2"
        type="text"
        @blur="form.c.$onBlur()"
      />
    </div>
    <div class="font-semibold mb-1 mt-4">Car Brands</div>
    <div
      v-for="brand in [
        'Audi',
        'BMW',
        'Mercedes',
        'Opel',
        'Porsche',
        'Volkswagen',
        'Ford'
      ]"
      :key="brand"
    >
      <label>
        <input
          v-model="form.d.$value"
          type="checkbox"
          :value="brand"
          :disabled="loading"
        />
        {{ brand }}
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
  <VPreFormData class="mt-24" :form="form" :errors="errors" />
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from 'vue';
import { useValidation, ValidationError, Field } from '../../../main';
import VPreFormData from '../components/common/VPreFormData/VPreFormData.vue';
import VButton from '../components/common/VButton/VButton.vue';
import { sleep } from '../utils';

type FormData = {
  a: Field<string>;
  b: Field<number>;
  c: Field<{ x: { y: { z: string } } }>;
  d: Field<string[]>;
};

export default defineComponent({
  components: {
    VPreFormData,
    VButton
  },
  setup() {
    const loading = ref(false);

    const { form, errors, submitting, validateFields, resetFields } =
      useValidation<FormData>({
        a: {
          $value: ''
        },
        b: {
          $value: 0,
          $rules: [
            b =>
              (10 <= b && b <= 100) ||
              'Please select a value between 10 and 100'
          ]
        },
        c: {
          $value: {
            x: {
              y: {
                z: ref('')
              }
            }
          },
          $rules: [() => sleep(2000)]
        },
        d: {
          $value: ref([])
        }
      });

    (async function () {
      loading.value = true;
      await sleep(500);

      resetFields({
        a: 'Hello',
        b: 50,
        c: {
          x: {
            y: {
              z: 'World'
            }
          }
        },
        d: ['BMW', 'Mercedes', 'Porsche']
      });

      loading.value = false;
    })();

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

    return { form, errors, submitting, loading, handleSubmit, resetFields };
  }
});
</script>
