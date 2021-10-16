import { expectType } from 'tsd'
import { Ref } from 'vue'
import { MaybeRef } from '../packages/vue3-form-validation/src/domain'
import { DeepMaybeRef } from '../packages/vue3-form-validation/src/form'

expectType<DeepMaybeRef<{ a: string }>>({} as { a: MaybeRef<string> })

expectType<DeepMaybeRef<{ a: string[] }>>(
  {} as {
    a: MaybeRef<string[]>
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
    a: MaybeRef<string>
    b: {
      c: MaybeRef<number>
    }
  }
)

expectType<
  DeepMaybeRef<{
    a: string
    b?: {
      c: number
    }
  }>
>(
  {} as {
    a: MaybeRef<string>
    b?: {
      c: MaybeRef<number>
    }
  }
)

expectType<
  DeepMaybeRef<{
    a: string
    b: {
      c: number
    }[]
  }>
>(
  {} as {
    a: MaybeRef<string>
    b: MaybeRef<
      {
        c: number
      }[]
    >
  }
)

expectType<DeepMaybeRef<string[]>>({} as MaybeRef<string[]>)

expectType<DeepMaybeRef<string>>({} as MaybeRef<string>)

expectType<DeepMaybeRef<{ a: { b: Ref<string> }[] }>>(
  {} as { a: MaybeRef<{ b: Ref<string> }[]> }
)
