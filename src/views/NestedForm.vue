<template>
  <h1 class="font-semibold text-2xl">Nested Form</h1>
  <form class="form my-8" @submit.prevent="handleSubmit()">
    <BaseInput
      v-model="form.test.a.b.c.d.$value"
      label="Nested A"
      :errors="form.test.a.b.c.d.$errors"
      @blur="form.test.a.b.c.d.$onBlur()"
    />
    <BaseInput
      v-model.number="form.test.a.b.e.$value"
      label="Nested E"
      type="number"
      :errors="form.test.a.b.e.$errors"
      @blur="form.test.a.b.e.$onBlur()"
    />
    <BaseInput
      v-model="form.test.f.$value.foo.a.c"
      label="Nested F"
      :errors="form.test.f.$errors"
      @blur="form.test.f.$onBlur()"
    />
    <BaseButton class="mt-8" type="primary" html-type="submit">
      Submit
    </BaseButton>
  </form>
  <pre>{{ form }}</pre>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseInput from '../components/form/BaseInput.vue';
import BaseButton from '../components/BaseButton.vue';
import { useValidation } from '../../main/composable/useValidation';

export default defineComponent({
  components: { BaseInput, BaseButton },
  setup() {
    const { form, onSubmit } = useValidation({
      test: {
        a: {
          b: {
            c: {
              d: {
                $value: '',
                $rules: [(d: string) => !d && 'a is required']
              }
            },
            e: {
              $value: (null as unknown) as number,
              $rules: [(e: number) => !e && 'e is required']
            }
          }
        },
        f: {
          $value: {
            foo: {
              a: {
                c: ''
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
      onSubmit(formData => {
        console.log(JSON.stringify(formData, null, 2));
      });
    };

    return {
      form,
      handleSubmit
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
