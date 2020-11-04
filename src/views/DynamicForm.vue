<template>
  <BaseButton @click="addGroup()" class="w-full">Add group</BaseButton>
  <form class="form my-8" @submit.prevent="handleSubmit()">
    <div class="col-span-3">
      <label class="block mb-2">Name</label>
      <input
        class="border outline-none px-2 py-1 w-full"
        autocomplete="off"
        @blur="form.name.onBlur()"
        v-model="form.name.value"
      />
    </div>

    <template v-for="(group, groupIndex) in form.groups" :key="group.name.uid">
      <div>
        <label class="block mb-2">Group name</label>
        <input
          class="border outline-none px-2 py-1 w-full"
          autocomplete="off"
          @blur="group.name.onBlur()"
          v-model="group.name.value"
        />
      </div>
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
        <div>
          <label class="block mb-2">Detail name</label>
          <input
            class="border outline-none px-2 py-1 w-full"
            autocomplete="off"
            @blur="detail.name.onBlur()"
            v-model="detail.name.value"
          />
        </div>
        <div>
          <label class="block mb-2">Detail short</label>
          <input
            class="border outline-none px-2 py-1 w-full"
            autocomplete="off"
            @blur="detail.short.onBlur()"
            v-model="detail.short.value"
          />
        </div>
        <BaseButton @click="removeDetail(groupIndex, detailIndex)" class="mt-4">
          Remove detail
        </BaseButton>
      </template>
    </template>

    <BaseButton class="col-span-3" type="primary" htmlType="submit">
      Submit
    </BaseButton>
  </form>
  <pre>{{ form }}</pre>
</template>

<script lang="ts">
import BaseButton from '../components/BaseButton.vue';
import { defineComponent, ref, watch } from 'vue';
import { useValidation } from '../../vue3-form-validation/composable/useValidation';

type Input = {
  name: any;
  groups: {
    name: any;
    details: {
      name: any;
      short: any;
    }[];
  }[];
};

export default defineComponent({
  components: {
    BaseButton
  },
  setup() {
    const { form, add, remove, onSubmit } = useValidation<Input>({
      name: {
        value: '',
        rules: [name => !name && 'Name is required']
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
          value: '',
          rules: [(name: string) => !name && 'Name is required']
        },
        short: {
          value: '',
          rules: [(short: string) => !short && 'Name is required']
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
    }
  }
});
</script>

<style scoped>
.form {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 25px;
}
</style>
