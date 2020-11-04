<template>
  <BaseForm>
    <BaseInput label="Select something" list="test" autocomplete="off" />
    <datalist id="test" multiple>
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
      <option value="3">Option 3</option>
      <option value="4">Option 4</option>
    </datalist>
    <select multiple class="w-full border p-2">
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
      <option value="3">Option 3</option>
      <option value="4">Option 4</option>
    </select>
    <button @click="nextPage">Next page</button>
    <pre>{{ loading }}</pre>
    <pre>{{ mediaTypes }}</pre>
  </BaseForm>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from 'vue';
import BaseForm from '../components/form/BaseForm.vue';
import BaseInput from '../components/form/BaseInput.vue';
import useFetch from '../composable/useFetch';

interface PagedResponse<T> {
  data: T[];
  total: number;
  nextPage: string;
  prevPage: string;
}

interface MediaType {
  id: number;
  name: string;
  short: string;
}

export default defineComponent({
  components: { BaseInput, BaseForm },
  setup() {
    const { json, loading, response, error, exec } = useFetch<
      PagedResponse<MediaType>
    >('https://localhost:5001/api/mediatype');

    const nextPage = () => {
      if (json.value) {
        exec(json.value.nextPage);
      }
    };

    return {
      mediaTypes: computed(() => json.value ?? []),
      loading,
      nextPage
    };
  }
});
</script>

<style></style>
