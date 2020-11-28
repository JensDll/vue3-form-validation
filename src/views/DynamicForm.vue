<template>
  <h1 class="font-semibold text-2xl">Dynamic Form</h1>
  <form class="form my-8 w-3/4" @submit.prevent="handleSubmit()">
    <BaseInput
      v-model="form.profile.$value"
      class="col-span-3"
      label="Profile"
      :errors="form.profile.$errors"
      @blur="form.profile.$onBlur()"
    />
    <BaseButton class="mt-4 col-span-3" @click="addGroup()">
      Add group
    </BaseButton>
    <template v-for="(group, groupIndex) in form.groups" :key="group.name.$uid">
      <BaseInput
        v-model="group.name.$value"
        label="Group"
        :errors="group.name.$errors"
        @blur="group.name.$onBlur()"
      />
      <BaseButton class="mt-8 self-start" @click="addDetail(groupIndex)">
        Add detail
      </BaseButton>
      <BaseButton class="mt-8 self-start" @click="removeGroup(groupIndex)">
        Remove group
      </BaseButton>
      <template
        v-for="(detail, detailIndex) in group.details"
        :key="detail.name.$uid"
      >
        <BaseInput
          v-model="detail.name.$value"
          label="Name"
          :errors="detail.name.$errors"
          @blur="detail.name.$onBlur()"
        />
        <BaseInput
          v-model="detail.short.$value"
          label="Short"
          :errors="detail.short.$errors"
          @blur="detail.short.$onBlur()"
        />
        <BaseButton
          class="mt-8 self-start"
          @click="removeDetail(groupIndex, detailIndex)"
        >
          Remove detail
        </BaseButton>
      </template>
    </template>
    <BaseButton
      class="col-span-3 mt-8"
      type="primary"
      html-type="submit"
      :disabled="submitting"
    >
      Submit
    </BaseButton>
  </form>
  <pre>{{ formJSON }}</pre>
</template>

<script lang="ts">
import BaseButton from '../components/BaseButton.vue';
import BaseInput from '../components/form/BaseInput.vue';
import { defineComponent, ref } from 'vue';
import { useValidation, Field } from '../../main';

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
          $rules: [group => !group && 'Group name is required']
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
  },
  computed: {
    formJSON(): string {
      return JSON.stringify(
        this.form,
        (k, v) => (typeof v === 'function' ? 'function' : v),
        2
      );
    }
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
