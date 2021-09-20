<template>
  <input type="text" v-model="form.name.$value" @blur="form.name.$onBlur" />
  <pre>{{ form }}</pre>
</template>

<script setup lang="ts">
import { useValidation } from 'vue3-form-validation'

const { form } = useValidation({
  name: {
    $value: ''
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
