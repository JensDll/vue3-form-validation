<script setup lang="ts">
import { RouteRecordName, useRoute, useRouter } from 'vue-router'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/outline'

import { guards } from '~/utils'

const route = useRoute()
const router = useRouter()

const routeRecordNames: RouteRecordName[] = router
  .getRoutes()
  .map(({ name }) => name)
  .filter(guards.isDefined)

const lookup = new Map(routeRecordNames.map((name, i) => [name, i]))

function left() {
  if (route.name) {
    const i = lookup.get(route.name)!
    if (i !== 0) {
      router.push({ name: routeRecordNames[i - 1] })
    }
  }
}

function right() {
  if (route.name) {
    const i = lookup.get(route.name)!
    if (i !== routeRecordNames.length - 1) {
      router.push({ name: routeRecordNames[i + 1] })
    }
  }
}
</script>

<template>
  <nav class="flex">
    <ChevronLeftIcon class="chevron-left" @click="left" />
    <router-link
      class="router-link"
      v-for="name in routeRecordNames"
      :key="name"
      :to="{ name }"
    ></router-link>
    <ChevronRightIcon class="chevron-right" @click="right" />
  </nav>
</template>

<style lang="postcss" scoped>
.router-link {
  @apply block w-6 h-6 rounded-full bg-indigo-500 ml-4 transition-transform;

  &:hover {
    @apply outline-none bg-indigo-400;
    transform: scale(1.25);
  }

  &:focus {
    @apply outline-none;
    transform: scale(1.25);
  }

  &:first-of-type {
    @apply ml-0;
  }
}

.router-link-exact-active {
  transform: scale(1.25);
  box-shadow: 0 0 8px theme('colors.indigo.400');
}

.chevron-left,
.chevron-right {
  @apply w-6 h-6 cursor-pointer;

  &:hover {
    @apply text-indigo-600;
  }
}

.chevron-left {
  @apply mr-5;
}
.chevron-right {
  @apply ml-5;
}
</style>
