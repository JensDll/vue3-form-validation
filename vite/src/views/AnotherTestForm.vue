<template>
  <h1 class="font-semibold text-2xl">Test Form</h1>
  <form class="form my-8" @submit.prevent="handleSubmit()" @reset="resetFields">
    <BaseInput
      v-model="form.nestedRef.$value.a.b.c"
      class="mb-4"
      label="Nested object"
      :errors="form.nestedRef.$errors"
      @blur="form.nestedRef.$onBlur()"
    />
    <BaseInput
      v-model="form.flatRef.$value"
      class="mb-4"
      label="Flat string ref"
      :errors="form.flatRef.$errors"
      @blur="form.flatRef.$onBlur()"
    />
    <BaseInput
      v-model="form.flatString.$value"
      class="mb-8"
      label="Flat string"
      :errors="form.flatString.$errors"
      @blur="form.flatString.$onBlur()"
    />
    <BaseInput
      v-model="form.bool.$value"
      class="mb-8"
      label="Checkbox"
      type="checkbox"
      :errors="form.bool.$errors"
      @blur="form.bool.$onBlur()"
    />
    <div class="flex gap-4 mt-8 col-span-3">
      <BaseButton
        class="w-full"
        type="primary"
        html-type="submit"
        :disabled="submitting"
      >
        Submit
      </BaseButton>
      <BaseButton class="w-full" html-type="reset" :disabled="submitting">
        Reset
      </BaseButton>
    </div>
  </form>

  <pre>{{ form }}</pre>
</template>

<script>
import BaseInput from '../components/form/BaseInput.vue';
import BaseButton from '../components/BaseButton.vue';
import { defineComponent, ref } from 'vue';
import { useValidation } from '../../../main';

export default defineComponent({
  components: {
    BaseInput,
    BaseButton
  },
  setup() {
    const nested = ref('');

    const { form, submitting, resetFields, validateFields } = useValidation({
      a: '',
      nestedRef: {
        $value: {
          a: {
            b: {
              c: nested
            }
          }
        },
        $rules: [nested => !nested.a.b.c && 'This field is required']
      },
      flatRef: {
        $value: ref(''),
        $rules: [flat => !flat && 'This field is required']
      },
      flatString: {
        $value: '',
        $rules: [flat => !flat && 'This field is required']
      },
      bool: {
        $value: false,
        $rules: [bool => bool || 'Value has to be true']
      }
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
      handleSubmit,
      submitting,
      resetFields
    };
  }
});
</script>

<style scoped>
.form {
  max-width: 900px;
}
</style>
