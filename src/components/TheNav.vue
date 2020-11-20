<template>
  <div class="cont border-r">
    <nav class="nav">
      <router-link
        class="block relative"
        exact-active-class="nav-link-active"
        to="/"
      >
        <div class="py-3 pl-16" @click="inactiveAll()">Home</div>
      </router-link>

      <!-- Form sub menu -->
      <div
        class="py-3 pl-16 font-semibold cursor-pointer"
        :class="{ 'text-green-500': formMenu.active }"
        @click="formMenu.open = !formMenu.open"
      >
        Forms
      </div>
      <div v-if="formMenu.open">
        <router-link
          class="block relative"
          exact-active-class="nav-link-active"
          to="/login-form"
        >
          <div class="py-3 pl-20" @click="setFormMenuActive()">Login Form</div>
        </router-link>
        <router-link
          class="block relative"
          exact-active-class="nav-link-active"
          to="/dynamic-form"
        >
          <div class="py-3 pl-20" @click="setFormMenuActive()">
            Dynamic Form
          </div>
        </router-link>
        <router-link
          class="block relative"
          exact-active-class="nav-link-active"
          to="/nested-form"
        >
          <div class="py-3 pl-20" @click="setFormMenuActive()">Nested Form</div>
        </router-link>
        <router-link
          class="block relative"
          exact-active-class="nav-link-active"
          to="/test-form"
        >
          <div class="py-3 pl-20" @click="setFormMenuActive()">Test Form</div>
        </router-link>
        <router-link
          class="block relative"
          exact-active-class="nav-link-active"
          to="/another-test-form"
        >
          <div class="py-3 pl-20" @click="setFormMenuActive()">
            Another Form
          </div>
        </router-link>
      </div>

      <!-- Demo sub menu -->
      <div
        class="py-3 pl-16 font-semibold cursor-pointer"
        :class="{ 'text-green-500': demoMenu.active }"
        @click="demoMenu.open = !demoMenu.open"
      >
        Demos
      </div>
      <div v-if="demoMenu.open">
        <router-link
          class="block relative"
          exact-active-class="nav-link-active"
          to="/button-demo"
        >
          <div class="py-3 pl-20" @click="setDemoMenuActive()">Button Demo</div>
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
      },
      formMenu: {
        open: true,
        active: false
      }
    };
  },
  methods: {
    inactiveAll() {
      this.formMenu.active = false;
      this.demoMenu.active = false;
    },
    setFormMenuActive() {
      this.formMenu.active = true;
      this.demoMenu.active = false;
    },
    setDemoMenuActive() {
      this.demoMenu.active = true;
      this.formMenu.active = false;
    }
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
  @apply bg-green-50;
}

.nav-link-active::after {
  content: '';
  @apply absolute w-1 bg-green-500;
  top: 0;
  right: -1px;
  bottom: 0;
}
</style>
