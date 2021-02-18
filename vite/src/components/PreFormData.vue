<template>
  <pre>{{ errors }}</pre>
  <pre id="pre-form">{{ formJSON }}</pre>
</template>

<script>
export default {
  props: {
    form: {
      type: Object,
      required: true
    },
    errors: {
      type: Array,
      required: true
    }
  },
  computed: {
    formJSON() {
      return JSON.stringify(
        this.form,
        (k, v) => (typeof v === 'function' ? 'function' : v),
        2
      );
    }
  }
};
</script>

<style scoped>
#pre-form {
  margin-top: 10px;
}
</style>
