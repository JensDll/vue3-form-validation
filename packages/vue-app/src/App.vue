<template>
  <input type="text" v-model="form.name.$value" @blur="form.name.$setTouched" />
  <pre>{{ form }}</pre>
</template>

<script setup lang="ts">
import { Field, useValidation } from 'vue3-form-validation'
import { required } from '~/domain'

type FormData = {
  name: Field<string>
}

const { form, validateFields } = useValidation({
  name: {
    $value: '',
    $rules: [required('Name is required')]
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
