import { FieldNames, Field } from '../packages/vue3-form-validation'

import { expectType } from 'tsd'

expectType<'a' | 'c' | 'e'>(
  {} as FieldNames<{
    a: Field<string>
    b?: {
      c: Field<string>
      d?: {
        e: Field<string>
      }
    }[]
  }>
)
