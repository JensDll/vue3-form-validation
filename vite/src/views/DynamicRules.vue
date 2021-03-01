<template>
  <h1>Dynamic Rules</h1>
  <form class="mb-8 mt-10 grid gap-y-4" @submit.prevent="handleSubmit()">
    <BaseInput
      v-model="form.name.$value"
      :errors="form.name.$errors"
      label="Name"
      @blur="form.name.$onBlur()"
    />
    <BaseInput
      v-model="form.nickname.$value"
      :errors="form.nickname.$errors"
      label="Nickname"
      @blur="form.nickname.$onBlur()"
    />
    <label>
      <input v-model="nicknameRequired" type="checkbox" />
      Nickname is required
    </label>
    <div class="flex mt-4">
      <BaseButton class="mr-2 py-1" type="primary" html-type="submit">
        Submit
      </BaseButton>
      <BaseButton class="py-1" @click="resetFields()">Reset</BaseButton>
    </div>
  </form>

  <PreFormData :form="form" :errors="errors" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useValidation, Field } from '../../../main';
import BaseButton from '../components/BaseButton.vue';
import PreFormData from '../components/PreFormData.vue';
import BaseInput from '../components/BaseInput.vue';

type FormData = {
  name: Field<string>;
  nickname: Field<string>;
};

export default defineComponent({
  components: {
    PreFormData,
    BaseInput,
    BaseButton
  },
  setup() {
    const nicknameRequired = ref(false);

    const {
      form,
      errors,
      validateFields,
      resetFields
    } = useValidation<FormData>({
      name: {
        $value: '',
        $rules: [name => !name && 'Name is required']
      },
      nickname: {
        $value: '',
        $rules: [
          name => !name && nicknameRequired.value && 'Nickname is required'
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

    return {
      form,
      errors,
      handleSubmit,
      resetFields,
      nicknameRequired
    };
  }
});
</script>

<style scoped></style>
