import { expectType } from 'tsd'

import { MaybeRef } from 'shared'
import { ResultFormData } from 'vue3-form-validation'

expectType<ResultFormData<{ a: { $value: MaybeRef<string> } }>>(
  {} as { a: string }
)

expectType<ResultFormData<{ a?: { $value: MaybeRef<string> } }>>(
  {} as { a?: string }
)

expectType<ResultFormData<{ a: { b: { $value: MaybeRef<string> } } }>>(
  {} as { a: { b: string } }
)

expectType<ResultFormData<{ a?: { b: { $value: MaybeRef<string> } } }>>(
  {} as { a?: { b: string } }
)

expectType<
  ResultFormData<{
    as?: {
      b: {
        $value: MaybeRef<string>
      }
    }[]
  }>
>(
  {} as {
    as?: {
      b: string
    }[]
  }
)
