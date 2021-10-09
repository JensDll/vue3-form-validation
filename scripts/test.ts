import { computed, ref, ReactiveEffect, watchEffect, watch } from 'vue'
import { stop } from '@vue/reactivity'
const a = ref(0)

const foo = {
  plusOne: computed(() => a.value + 1)
}

// const watchStop = watch(a, () => {
//   console.log(a.value)
// })

// watchStop()
foo.plusOne.effect.stop() // better call this before
delete foo.plusOne
console.log(foo)
