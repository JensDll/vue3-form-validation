<template>
  <h1 class="font-semibold text-2xl">Test Form</h1>
  <form class="form my-8" @submit.prevent="handleSubmit()">
    <BaseInput
      class="mb-4"
      label="Nested object"
      v-model="form.nested.$value.a.b.c"
      :errors="form.nested.$errors"
      @blur="form.nested.$onBlur()"
    />
    <BaseInput
      class="mb-4"
      label="Flat string ref"
      v-model="form.flatRef.$value"
      :errors="form.flatRef.$errors"
      @blur="form.flatRef.$onBlur()"
    />
    <BaseInput
      class="mb-8"
      label="Flat string"
      v-model="form.flatString.$value"
      :errors="form.flatString.$errors"
      @blur="form.flatString.$onBlur()"
    />
    <BaseInput
      class="mb-8"
      label="Checkbox"
      type="checkbox"
      v-model="form.bool.$value"
      :errors="form.bool.$errors"
      @blur="form.bool.$onBlur()"
    />
    <BaseButton class="w-full" type="primary" htmlType="submit">
      Submit
    </BaseButton>
  </form>

  <pre>{{ form }}</pre>
</template>

<script lang="ts">
import BaseInput from '../components/form/BaseInput.vue';
import BaseButton from '../components/BaseButton.vue';
import { defineComponent, reactive, ref, watch } from 'vue';
import { useValidation } from '../../main/composable/useValidation';

export default defineComponent({
  components: {
    BaseInput,
    BaseButton
  },
  setup() {
    const nested = ref('');

    const { form, onSubmit } = useValidation({
      nested: {
        $value: {
          a: {
            b: {
              c: nested
            }
          }
        },
        $rules: [(nested: any) => !nested.a.b.c && 'This field is required']
      },
      flatRef: {
        $value: ref(''),
        $rules: [(flat: string) => !flat && 'This field is required']
      },
      flatString: {
        $value: '',
        $rules: [(flat: string) => !flat && 'This field is required']
      },
      bool: {
        $value: false,
        $rules: [(bool: boolean) => bool || 'Value has to be true']
      }
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
}
</style>
