<template>
  <div>
    <BaseButton class="mt-4">Button default</BaseButton>
    <BaseButton class="mt-4" type="primary">Button primary</BaseButton>
    <BaseButton class="mt-4" type="danger">Button danger</BaseButton>
    <BaseButton class="mt-4" disabled>Button default (disabled)</BaseButton>
    <BaseButton class="mt-4" type="primary" disabled>
      Button primary (disabled)
    </BaseButton>
    <BaseButton class="mt-4" type="danger" disabled>
      Button danger (disabled)
    </BaseButton>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { photoService } from '../services/photoService';
import BaseButton from '../components/BaseButton.vue';

export default defineComponent({
  components: { BaseButton },
  setup() {
    const x = ref(0);

    watch(x, x => {
      console.log(x);
    });

    return {
      x
    };
  }
});
</script>

<style></style>
