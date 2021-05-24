<template>
  <nav class="nav">
    <router-link class="router-link" to="/"></router-link>
    <router-link class="router-link" to="/array"></router-link>
    <router-link class="router-link" to="/dynamic-array"></router-link>
    <router-link class="router-link" to="/dynamic-object"></router-link>
    <router-link class="router-link" to="/initial-values"></router-link>
    <router-link class="router-link" to="/nested-ref"></router-link>
  </nav>
</template>

<script setup lang="ts"></script>

<style lang="postcss" scoped>
.nav {
  z-index: 10;
  position: sticky;
  display: flex;
  grid-area: nav-links;
  top: 50px;
}

.router-link {
  @apply block cursor-pointer rounded-full;
  width: 20px;
  height: 20px;
  background-color: theme('colors.blue.50');
  border: 1px solid theme('colors.blue.500');
  margin: 0 8px;
  transition: transform 0.1s;
}

.router-link:hover {
  transform: scale(1.4);
}

.router-link-active {
  transform: scale(1.4);
  box-shadow: 0 0 3px theme('colors.blue.500');
}
</style>
