<template>
  <h1 class="font-semibold text-2xl">Nested form</h1>
  <form class="form my-8" @submit.prevent="handleSubmit()">
    <BaseInput
      label="Nested d"
      v-model="form.test.a.b.c.d.value"
      :errors="form.test.a.b.c.d.errors"
      @blur="form.test.a.b.c.d.onBlur()"
    />
    <BaseInput
      label="Nested e"
      type="number"
      v-model.number="form.test.a.b.e.value"
      :errors="form.test.a.b.e.errors"
      @blur="form.test.a.b.e.onBlur()"
    />
    <BaseInput
      label="Nested f"
      v-model.number="form.test.f.value"
      :errors="form.test.f.errors"
      @blur="form.test.f.onBlur()"
    />
    <BaseButton class="mt-8" type="primary" htmlType="submit">
      Submit
    </BaseButton>
  </form>
  <pre>{{ form }}</pre>
</template>

<script lang="ts">
import { computed, defineComponent, markRaw, reactive, ref, watch } from 'vue';
import BaseInput from '../components/form/BaseInput.vue';
import BaseButton from '../components/BaseButton.vue';
import { useValidation, Field } from '../../main/composable/useValidation';

export default defineComponent({
  components: { BaseInput, BaseButton },
  setup() {
    const { form, onSubmit } = useValidation({
      test: {
        a: {
          b: {
            c: {
              d: {
                value: '',
                rules: [(d: string) => !d && 'a is required']
              }
            },
            e: {
              value: 0,
              rules: [(e: number) => !e && 'e is required']
            }
          }
        },
        f: {
          value: '',
          rules: [(f: string) => !f && 'f is required']
        }
      },
      xs: [
        {
          a: {
            b: {
              value: true
            }
          }
        },
        {
          a: {
            b: {
              value: true
            }
          }
        }
      ]
    });

    const handleSubmit = () => {
      onSubmit(formData => {
        console.log(formData);
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
  max-width: 1000px;
  row-gap: 10px;
  display: grid;
}
</style>
