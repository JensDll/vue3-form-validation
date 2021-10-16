import {
  TransformedFormData,
  TransformedField,
  Field
} from '../packages/vue3-form-validation/src/form'
import { MaybeRef } from '../packages/vue3-form-validation/src/domain'
import { expectType, expectAssignable } from 'tsd'

// Testing without using the Field type
expectType<TransformedFormData<{ a: { $value: MaybeRef<10> } }>>(
  {} as {
    a: TransformedField<10>
  }
)

expectType<TransformedFormData<{ a?: { $value: MaybeRef<10> } }>>(
  {} as {
    a?: TransformedField<10>
  }
)

expectType<
  TransformedFormData<{ a: { $value: MaybeRef<10>; extra: MaybeRef<''> } }>
>(
  {} as {
    a: TransformedField<10, { extra: '' }>
  }
)

expectType<
  TransformedFormData<{
    as: {
      b: {
        $value: MaybeRef<10>
      }
    }[]
  }>
>(
  {} as {
    as: {
      b: TransformedField<10>
    }[]
  }
)

expectAssignable<
  TransformedFormData<{
    as?: {
      b?: {
        $value: MaybeRef<10>
      }
    }[]
  }>
>(
  {} as {
    as?: {
      b?: TransformedField<10>
    }[]
  }
)

expectType<
  TransformedFormData<{
    as: {
      b: {
        $value: MaybeRef<10>
        extra: MaybeRef<''>
        stuff: MaybeRef<''>
      }
    }[]
  }>
>(
  {} as {
    as: {
      b: TransformedField<10, { extra: ''; stuff: '' }>
    }[]
  }
)

// Testing with using the Field type
expectType<TransformedFormData<{ a: Field<10> }>>(
  {} as {
    a: TransformedField<10>
  }
)

expectType<TransformedFormData<{ a?: Field<10> }>>(
  {} as {
    a?: TransformedField<10>
  }
)

expectType<TransformedFormData<{ a: Field<10, { extra: '' }> }>>(
  {} as {
    a: TransformedField<10, { extra: '' }>
  }
)

expectType<
  TransformedFormData<{
    as: {
      b: Field<10>
    }[]
  }>
>(
  {} as {
    as: {
      b: TransformedField<10>
    }[]
  }
)

expectType<
  TransformedFormData<{
    as?: {
      b?: Field<10>
    }[]
  }>
>(
  {} as {
    as?: {
      b?: TransformedField<10>
    }[]
  }
)

expectType<
  TransformedFormData<{
    as: {
      b: Field<10, { extra: ''; stuff: '' }>
    }[]
  }>
>(
  {} as {
    as: {
      b: TransformedField<10, { extra: ''; stuff: '' }>
    }[]
  }
)
