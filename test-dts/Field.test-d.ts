import { expectType } from 'tsd'
import { Ref } from 'vue'
import { FieldRule, Field } from '../packages/vue3-form-validation/src/form'
import { MaybeRef } from '../packages/vue3-form-validation/src/domain'

expectType<Field<string>>(
  {} as {
    $value: MaybeRef<string>
    $rules?: FieldRule<string>[]
  }
)

expectType<Field<Ref<string>>>(
  {} as {
    $value: MaybeRef<string>
    $rules?: FieldRule<string>[]
  }
)

expectType<Field<{ a: { b: string } }>>(
  {} as {
    $value: { a: { b: MaybeRef<string> } }
    $rules?: FieldRule<{ a: { b: string } }>[]
  }
)

expectType<Field<{ a: { b: Ref<string> } }>>(
  {} as {
    $value: { a: { b: MaybeRef<string> } }
    $rules?: FieldRule<{ a: { b: string } }>[]
  }
)

expectType<Field<string[]>>(
  {} as {
    $value: MaybeRef<string[]>
    $rules?: FieldRule<string[]>[]
  }
)

expectType<
  Field<{
    as: string[]
    b: Ref<string>
  }>
>(
  {} as {
    $value: {
      as: MaybeRef<string[]>
      b: MaybeRef<string>
    }
    $rules?: FieldRule<{
      as: string[]
      b: string
    }>[]
  }
)

expectType<Field<Ref<string>[]>>(
  {} as {
    $value: MaybeRef<Ref<string>[]>
    $rules?: FieldRule<Ref<string>[]>[]
  }
)
