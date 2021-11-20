import { expectType } from 'tsd'

import { FieldNames, Field } from 'vue3-form-validation'

expectType<'a' | 'c' | 'e'>(
  {} as FieldNames<{
    a: Field<string>
    b?: {
      c: Field<string>
      d?: {
        e?: Field<string>
      }
    }[]
  }>
)
