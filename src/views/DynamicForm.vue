<template>
  <h1 class="font-semibold text-2xl">Dynamic Form</h1>
  <form class="form my-8 w-3/4" @submit.prevent="handleSubmit()">
    <BaseInput
      class="col-span-3"
      label="Profile"
      v-model="form.profile.$value"
      :errors="form.profile.$errors"
      @blur="form.profile.$onBlur()"
    />
    <BaseButton @click="addGroup()" class="mt-4 col-span-3">
      Add group
    </BaseButton>
    <template v-for="(group, groupIndex) in form.groups" :key="group.name.$uid">
      <BaseInput
        label="Group"
        v-model="group.name.$value"
        :errors="group.name.$errors"
        @blur="group.name.$onBlur()"
      />
      <BaseButton @click="addDetail(groupIndex)" class="mt-8 self-start">
        Add detail
      </BaseButton>
      <BaseButton @click="removeGroup(groupIndex)" class="mt-8 self-start">
        Remove group
      </BaseButton>
      <template
        v-for="(detail, detailIndex) in group.details"
        :key="detail.name.$uid"
      >
        <BaseInput
          label="Name"
          v-model="detail.name.$value"
          :errors="detail.name.$errors"
          @blur="detail.name.$onBlur()"
        />
        <BaseInput
          label="Short"
          v-model="detail.short.$value"
          :errors="detail.short.$errors"
          @blur="detail.short.$onBlur()"
        />
        <BaseButton
          @click="removeDetail(groupIndex, detailIndex)"
          class="mt-8 self-start"
        >
          Remove detail
        </BaseButton>
      </template>
    </template>
    <BaseButton
      class="col-span-3 mt-8"
      type="primary"
      htmlType="submit"
      :disabled="submitting"
    >
      Submit
    </BaseButton>
  </form>
  <pre>{{ form }}</pre>
</template>

<script lang="ts">
import BaseButton from '../components/BaseButton.vue';
import BaseInput from '../components/form/BaseInput.vue';
import { defineComponent, ref, watch } from 'vue';
import { useValidation, Field } from '../../main/composable/useValidation';

type Input = {
  profile: Field<string>;
  groups: {
    name: Field<string>;
    details: {
      name: Field<string>;
      short: Field<string>;
    }[];
  }[];
};

export default defineComponent({
  components: {
    BaseButton,
    BaseInput
  },
  setup() {
    const { form, add, remove, onSubmit } = useValidation<Input>({
      profile: {
        $value: '',
        $rules: [profile => !profile && 'Profile name is required']
      },
      groups: []
    });

    const addGroup = () => {
      add(['groups'], {
        name: {
          $value: '',
          $rules: [(name: string) => !name && 'Group name is required']
        },
        details: []
      });
    };

    const removeGroup = (index: number) => {
      remove(['groups'], index);
    };

    const addDetail = (groupIndex: number) => {
      add(['groups', groupIndex, 'details'], {
        name: {
          $value: '',
          $rules: [(name: string) => !name && 'Detail name is required']
        },
        short: {
          $value: '',
          $rules: [(short: string) => !short && 'Detail short is required']
        }
      });
    };

    const removeDetail = (groupIndex: number, detailIndex: number) => {
      remove(['groups', groupIndex, 'details'], detailIndex);
    };

    const submitting = ref(false);

    const handleSubmit = () => {
      submitting.value = true;
      onSubmit(
        formData => {
          console.log(JSON.stringify(formData, null, 2));
          submitting.value = false;
        },
        () => {
          submitting.value = false;
        }
      );
    };

    return {
      form,
      addGroup,
      removeGroup,
      addDetail,
      removeDetail,
      handleSubmit,
      submitting
    };
  }
});
</script>

<style scoped>
.form {
  max-width: 900px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  row-gap: 10px;
  column-gap: 20px;
}
</style>
