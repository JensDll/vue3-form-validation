<template>
  <h1 class="font-semibold text-2xl">Dynamic Form</h1>
  <form class="form my-8 w-3/4" @submit.prevent="handleSubmit()">
    <BaseButton @click="addGroup()" class="col-span-3">Add group</BaseButton>
    <BaseInput
      class="col-span-3"
      label="Profile"
      v-model="form.name.value"
      :errors="form.name.errors"
      @blur="form.name.onBlur()"
    />

    <template v-for="(group, groupIndex) in form.groups" :key="group.name.uid">
      <BaseInput
        label="Group"
        v-model="group.name.value"
        :errors="group.name.errors"
        @blur="group.name.onBlur()"
      />
      <BaseButton @click="addDetail(groupIndex)" class="mt-4">
        Add detail
      </BaseButton>
      <BaseButton @click="removeGroup(groupIndex)" class="mt-4">
        Remove group
      </BaseButton>

      <template
        v-for="(detail, detailIndex) in group.details"
        :key="detail.name.uid"
      >
        <BaseInput
          label="Name"
          v-model="detail.name.value"
          :errors="detail.name.errors"
          @blur="detail.name.onBlur()"
        />
        <BaseInput
          label="Short"
          v-model="detail.short.value"
          :errors="detail.short.errors"
          @blur="detail.short.onBlur()"
        />
        <BaseButton @click="removeDetail(groupIndex, detailIndex)" class="mt-4">
          Remove detail
        </BaseButton>
      </template>
    </template>

    <BaseButton class="col-span-3 mt-8" type="primary" htmlType="submit">
      Submit
    </BaseButton>
  </form>
  <pre>{{ form }}</pre>
</template>

<script lang="ts">
import BaseButton from '../components/BaseButton.vue';
import BaseInput from '../components/form/BaseInput.vue';
import { defineComponent, ref, watch } from 'vue';
import {
  useValidation,
  Field
} from '../../vue3-form-validation/composable/useValidation';

type Input = {
  name: Field<string>;
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
      name: {
        value: '',
        rules: [name => !name && 'Profile name is required']
      },
      groups: []
    });

    const addGroup = () => {
      add(['groups'], {
        name: {
          value: '',
          rules: [(name: string) => !name && 'Group name is required']
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
          value: ref(''),
          rules: [(name: string) => !name && 'Detail name is required']
        },
        short: {
          value: '',
          rules: [(short: string) => !short && 'Detail short is required']
        }
      });
    };

    const removeDetail = (groupIndex: number, detailIndex: number) => {
      remove(['groups', groupIndex, 'details'], detailIndex);
    };

    return {
      form,
      addGroup,
      removeGroup,
      addDetail,
      removeDetail,
      onSubmit
    };
  },
  methods: {
    handleSubmit() {
      this.onSubmit(formData => {
        console.log(formData);
      });
      console.log('SUBMIT');
    }
  }
});
</script>

<style scoped>
.form {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
}
</style>
