<template>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    stroke-width="2"
    :class="{ spin }"
  >
    <path
      d="M23 12C23 14.4106 22.2081 16.7545 20.7461 18.6712C19.2842 20.5879 17.233 21.9713 14.9082 22.6086C12.5833 23.2459 10.1135 23.1019 7.87847 22.1987C5.64345 21.2955 3.76702 19.683 2.53773 17.6094C1.30844 15.5358 0.794365 13.1157 1.07456 10.7214C1.35475 8.32716 2.41369 6.0912 4.08855 4.35743C5.7634 2.62365 7.96142 1.48805 10.3446 1.12528C12.7278 0.762497 15.1641 1.19262 17.279 2.34951"
    />
  </svg>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    spin: {
      type: Boolean,
      default: true
    }
  }
});
</script>

<style scoped>
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.spin {
  animation: spin 0.5s linear infinite;
}
</style>
