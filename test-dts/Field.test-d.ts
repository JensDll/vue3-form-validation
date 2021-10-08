import { expectType } from 'tsd'
import { Ref } from 'vue'
import { ValidationBehavior } from '../packages/vue3-form-validation/src/form'
import { Field } from '../packages/vue3-form-validation/src/composition'
import { Rule, MaybeRef } from '../packages/vue3-form-validation/src/domain'

expectType<Field<string>>(
  {} as {
    $value: MaybeRef<string>
    $rules?: Rule<string>[]
    $validationBehavior?: ValidationBehavior
  }
)

expectType<Field<Ref<string>>>(
  {} as {
    $value: MaybeRef<string>
    $rules?: Rule<string>[]
    $validationBehavior?: ValidationBehavior
  }
)

expectType<Field<{ a: { b: string } }>>(
  {} as {
    $value: { a: { b: MaybeRef<string> } }
    $rules?: Rule<{ a: { b: string } }>[]
    $validationBehavior?: ValidationBehavior
  }
)

expectType<Field<{ a: { b: Ref<string> } }>>(
  {} as {
    $value: { a: { b: MaybeRef<string> } }
    $rules?: Rule<{ a: { b: string } }>[]
    $validationBehavior?: ValidationBehavior
  }
)

expectType<Field<string[]>>(
  {} as {
    $value: MaybeRef<string[]>
    $rules?: Rule<string[]>[]
    $validationBehavior?: ValidationBehavior
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
    $rules?: Rule<{
      as: string[]
      b: string
    }>[]
    $validationBehavior?: ValidationBehavior
  }
)

expectType<Field<Ref<string>[]>>(
  {} as {
    $value: MaybeRef<Ref<string>[]>
    $rules?: Rule<Ref<string>[]>[]
    $validationBehavior?: ValidationBehavior
  }
)
