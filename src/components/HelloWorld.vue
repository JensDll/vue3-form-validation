<template>
  <h1>{{ msg }}</h1>
  <button type="submit" @click="count++">
    count is: {{ count }}awdaw dwa dawd awd awdawdaw
  </button>
  <p>
    Edit <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      count: 0
    };
  }
});
</script>
