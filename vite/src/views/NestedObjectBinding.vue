<template>
  <h1>Nested Object Binding</h1>
  <form class="mb-8 mt-10" @submit.prevent="handleSubmit()">
    <label>
      <div>Nested Object</div>
      <input
        v-model="form.nested.$value.a"
        class="border py-1 px-2"
        type="text"
        @blur="form.nested.$onBlur"
      />
    </label>
    <label>
      <div>Nested Array</div>
      <input v-model="form.nested.$value.b.c.ds" type="checkbox" value="Test" />
    </label>
    <div class="flex mt-4">
      <BaseButton
        class="mr-2 py-1"
        type="primary"
        html-type="submit"
        :disabled="submitting"
      >
        Submit
      </BaseButton>
      <BaseButton class="py-1" @click="handleReset()">Reset</BaseButton>
    </div>
  </form>
  <PreFormData :form="form" :errors="errors" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useValidation } from '../../../main';
import BaseButton from '../components/BaseButton.vue';
import PreFormData from '../components/PreFormData.vue';

export default defineComponent({
  components: { BaseButton, PreFormData },
  setup() {
    const {
      form,
      errors,
      submitting,
      validateFields,
      resetFields
    } = useValidation({
      nested: {
        $value: {
          a: ref(''),
          b: {
            c: {
              ds: []
            }
          }
        },
        $rules: [
          () =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve(true);
              }, 2000);
            })
        ]
      }
    });

    const handleSubmit = () => {
      validateFields()
        .then(formData => {
          console.log(JSON.stringify(formData, null, 2));
        })
        .catch(() => {
          // validation error
        });
    };

    const handleReset = () => {
      resetFields({
        nested: {
          a: 'abc',
          b: {
            c: {
              ds: []
            }
          }
        }
      });
    };

    return {
      form,
      errors,
      submitting,
      handleSubmit,
      handleReset
    };
  }
});
</script>

<style></style>
