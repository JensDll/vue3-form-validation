<template>
  <nav class="nav">
    <router-link class="router-link" to="/"></router-link>
    <router-link class="router-link" to="/dynamic-form"></router-link>
    <router-link class="router-link" to="/array-binding"></router-link>
    <router-link class="router-link" to="/dynamic-rules"></router-link>
    <router-link class="router-link" to="/nested-object-binding"></router-link>
    <router-link class="router-link" to="/async-form-loading"></router-link>
  </nav>
</template>

<script lang="ts">
export default {};
</script>

<style scoped>
.nav {
  position: sticky;
  top: 40px;
  z-index: 20;
  display: flex;
}

.router-link {
  @apply bg-green-100 border border-green-500;
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin: 0 8px;
  transition: transform 0.1s;
}

.router-link:hover {
  transform: scale(1.3);
}

.router-link-active {
  transform: scale(1.3);
  box-shadow: 0 0 3px theme('colors.green.500');
}
</style>
