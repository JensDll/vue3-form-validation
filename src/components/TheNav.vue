<template>
  <div class="cont border-r">
    <nav class="nav">
      <router-link
        class="block relative py-3 pl-16"
        exact-active-class="nav-link-active"
        to="/"
      >
        <span @click="demoMenu.active = false">Login Form</span>
      </router-link>
      <router-link
        class="block relative py-3 pl-16"
        exact-active-class="nav-link-active"
        to="/dynamic-form"
      >
        <span @click="demoMenu.active = false">Dynamic Form</span>
      </router-link>
      <router-link
        class="block relative py-3 pl-16"
        exact-active-class="nav-link-active"
        to="/nested-form"
      >
        <span @click="demoMenu.active = false">Nested form</span>
      </router-link>
      <div
        class="py-3 pl-16 font-semibold cursor-pointer"
        :class="{ 'text-green-500': demoMenu.active }"
        @click="demoMenu.open = !demoMenu.open"
      >
        Demos
      </div>
      <div v-if="demoMenu.open">
        <router-link
          class="block relative py-3 pl-20"
          exact-active-class="nav-link-active"
          to="/button-demo"
        >
          <span @click="demoMenu.active = true">Button demo</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      demoMenu: {
        open: true,
        active: false
      }
    };
  }
});
</script>

<style scoped>
.cont {
  grid-area: nav;
  width: 300px;
}

.nav {
  position: sticky;
  top: 30px;
}

.nav-link-active {
  @apply bg-green-100;
}

.nav-link-active::after {
  content: '';
  @apply absolute w-1 bg-green-500;
  top: 0;
  right: -1px;
  bottom: 0;
}
</style>
