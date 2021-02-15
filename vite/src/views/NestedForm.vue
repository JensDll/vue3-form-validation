<template>
  <h1 class="font-semibold text-2xl">Nested Form</h1>
  <form class="form my-8" @submit.prevent="handleSubmit()">
    <BaseInput
      v-model="form.test.a.b.c.d.$value"
      label="Nested d"
      :errors="form.test.a.b.c.d.$errors"
      @blur="form.test.a.b.c.d.$onBlur()"
    />
    <BaseInput
      v-model.number="form.test.a.b.e.$value"
      label="Nested e"
      type="number"
      :errors="form.test.a.b.e.$errors"
      @blur="form.test.a.b.e.$onBlur()"
    />
    <BaseInput
      v-model="form.test.f.$value.foo.a.c"
      label="Nested f"
      :errors="form.test.f.$errors"
      @blur="form.test.f.$onBlur()"
    />
    <div class="flex gap-4 mt-8">
      <BaseButton
        class="w-full"
        type="primary"
        html-type="submit"
        :disabled="submitting"
      >
        Submit
      </BaseButton>
      <BaseButton class="w-full" @click="resetFields">Reset</BaseButton>
    </div>
  </form>
  <pre>{{ form }}</pre>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import BaseInput from '../components/form/BaseInput.vue';
import BaseButton from '../components/BaseButton.vue';
import { useValidation } from '../../../main';

export default defineComponent({
  components: { BaseInput, BaseButton },
  setup() {
    const { form, submitting, resetFields, validateFields } = useValidation({
      x: '',
      test: {
        a: {
          b: {
            y: '',
            c: {
              d: {
                $value: ref(''),
                $rules: [(d: string) => !d && 'd is required']
              }
            },
            e: {
              $value: null,
              $rules: [(e: null) => !e && 'e is required']
            }
          }
        },
        f: {
          $value: {
            foo: {
              a: {
                c: ref('')
              }
            }
          },
          $rules: [
            (f: { foo: { a: { c: string } } }) => !f.foo.a.c && 'f is required'
          ]
        }
      },
      xs: [
        {
          a: {
            b: {
              $value: true
            }
          }
        },
        {
          a: {
            b: {
              $value: true
            }
          }
        }
      ]
    });

    const handleSubmit = () => {
      validateFields()
        .then(formData => {
          console.log(JSON.stringify(formData, null, 2));
        })
        .catch(() => {
          //
        });
    };

    return {
      form,
      submitting,
      handleSubmit,
      resetFields
    };
  }
});
</script>

<style scoped>
.form {
  max-width: 900px;
  row-gap: 10px;
  display: grid;
}
</style>
