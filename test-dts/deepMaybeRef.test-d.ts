import { expectType } from 'tsd'
import { Ref } from 'vue'
import {
  DeepMaybeRef,
  MaybeRef
} from '../packages/vue3-form-validation/src/domain'

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

expectType<DeepMaybeRef<string[]>>({} as MaybeRef<string[]>)

expectType<DeepMaybeRef<string>>({} as MaybeRef<string>)

expectType<DeepMaybeRef<{ a: { b: Ref<string> }[] }>>(
  {} as { a: MaybeRef<{ b: Ref<string> }[]> }
)
