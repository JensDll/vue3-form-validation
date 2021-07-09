<template>
  <nav class="nav">
    <ChevronLeftIcon
      class="mr-4 w-6 h-6 cursor-pointer hover:text-emerald-500"
      @click="prevPage"
    />
    <router-link
      v-for="(link, i) in links"
      :key="i"
      class="router-link"
      :to="link"
    ></router-link>
    <ChevronRightIcon
      class="ml-4 w-6 h-6 cursor-pointer hover:text-emerald-500"
      @click="nextPage"
    />
  </nav>
</template>

<script lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/outline';
import { defineComponent } from 'vue';

const links = ['/', '/dynamic-form', '/file-upload'];

export default defineComponent({
  components: {
    ChevronLeftIcon,
    ChevronRightIcon
  },
  data() {
    return {
      links,
      lookup: new Map(links.map((link, i) => [link, i]))
    };
  },
  methods: {
    nextPage() {
      const i = this.lookup.get(this.$route.fullPath);
      if (i !== undefined && i < this.links.length - 1) {
        this.$router.push(this.links[i + 1]);
      }
    },
    prevPage() {
      const i = this.lookup.get(this.$route.fullPath);
      if (i !== undefined && i > 0) {
        this.$router.push(this.links[i - 1]);
      }
    }
  }
});
</script>

<style lang="postcss" scoped>
.nav {
  z-index: 10;
  position: sticky;
  top: 3rem;
  display: flex;
  align-items: center;
}

.router-link {
  @apply block w-5 h-5 mx-2 rounded-full;
  @apply border border-emerald-500 bg-emerald-50;
  transition: transform 0.1s;
}

.router-link:hover {
  transform: scale(1.4);
}

.router-link-active {
  transform: scale(1.4);
  box-shadow: 0 0 3px theme('colors.emerald.500');
}
</style>
