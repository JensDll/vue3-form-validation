import { MaybeRef } from '../packages/vue3-form-validation/src/domain'
import { ResultFormData } from '../packages/vue3-form-validation/src/form'

expect<ResultFormData<{ a: { $value: MaybeRef<string> } }>>({} as { a: string })

expect<ResultFormData<{ a?: { $value: MaybeRef<string> } }>>(
  {} as { a?: string }
)

expect<ResultFormData<{ a: { b: { $value: MaybeRef<string> } } }>>(
  {} as { a: { b: string } }
)

expect<ResultFormData<{ a?: { b: { $value: MaybeRef<string> } } }>>(
  {} as { a?: { b: string } }
)

expect<
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
