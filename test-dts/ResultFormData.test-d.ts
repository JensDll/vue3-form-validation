import { expectType } from 'tsd'

import { MaybeRef } from 'vue3-form-validation/src/domain'
import { ResultFormData } from 'vue3-form-validation/src/form'

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
