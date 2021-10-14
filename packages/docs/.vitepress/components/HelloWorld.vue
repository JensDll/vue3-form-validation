<template>
  <h1>Hallo {{ a }}</h1>
  <button @click="add()">Click</button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const a = ref(0)

function add() {
  a.value++
}
</script>

<style scoped></style>
