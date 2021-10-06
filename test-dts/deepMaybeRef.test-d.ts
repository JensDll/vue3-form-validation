import { expectType } from 'tsd'
import { Ref } from 'vue'
import { DeepMaybeRef } from '../packages/vue3-form-validation/src/common/types'

expectType<DeepMaybeRef<{ a: string }>>({} as { a: Ref<string> | string })

expectType<DeepMaybeRef<{ a: string[] }>>(
  {} as {
    a: Ref<string[]> | string[]
  }
)

expectType<
  DeepMaybeRef<{
    a: string
    b: {
      c: number
    }
  }>
>(
  {} as {
    a: Ref<string> | string
    b: {
      c: Ref<number> | number
    }
  }
)

expectType<DeepMaybeRef<string[]>>({} as string[] | Ref<string[]>)

expectType<DeepMaybeRef<string>>({} as string | Ref<string>)

expectType<DeepMaybeRef<{ a: { b: Ref<string> }[] }>>(
  {} as { a: { b: Ref<string> }[] | Ref<{ b: Ref<string> }[]> }
)
