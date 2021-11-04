import { expectAssignable } from 'tsd'
import { Ref } from 'vue'

import { MaybeRef, DeepMaybeRef } from 'vue3-form-validation/src/domain'

expectAssignable<DeepMaybeRef<string[]>>({} as MaybeRef<string[]>)

expectAssignable<DeepMaybeRef<string>>({} as MaybeRef<string>)

expectAssignable<DeepMaybeRef<{ a: string }>>({} as { a: MaybeRef<string> })

expectAssignable<DeepMaybeRef<{ a: string[] }>>(
  {} as {
    a: MaybeRef<string[]>
  }
)

expectAssignable<
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

expectAssignable<
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

expectAssignable<
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
        c: MaybeRef<number>
      }[]
    >
  }
)

expectAssignable<
  DeepMaybeRef<{
    a: {
      b: Ref<string>
    }[]
  }>
>(
  {} as {
    a: MaybeRef<
      {
        b: MaybeRef<string>
      }[]
    >
  }
)
