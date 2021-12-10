import { expectType } from 'tsd'

import { MaybeRef } from 'shared'
import {
  TransformFormData,
  TransformedField,
  Field
} from 'vue3-form-validation'

// Testing without using the Field type

expectType<TransformFormData<{ a: { $value: MaybeRef<10> } }>>(
  {} as {
    a: TransformedField<10>
  }
)

expectType<TransformFormData<{ a?: { $value: MaybeRef<10> } }>>(
  {} as {
    a?: TransformedField<10>
  }
)

expectType<
  TransformFormData<{
    a: {
      $value: {
        a: number
      }
    }
  }>
>(
  {} as {
    a: TransformedField<{ a: number }>
  }
)

expectType<
  TransformFormData<{ a: { $value: MaybeRef<10>; extra: MaybeRef<''> } }>
>(
  {} as {
    a: TransformedField<10, { extra: '' }>
  }
)

expectType<
  TransformFormData<{
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

expectType<
  TransformFormData<{
    as?: {
      b?: {
        $value: MaybeRef<10>
        extra: ''
        stuff: ''
      }
    }[]
  }>
>(
  {} as {
    as?: {
      b?: TransformedField<10, { extra: ''; stuff: '' }>
    }[]
  }
)

expectType<
  TransformFormData<{
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

expectType<TransformFormData<{ a: Field<10> }>>(
  {} as {
    a: TransformedField<10>
  }
)

expectType<TransformFormData<{ a?: Field<10> }>>(
  {} as {
    a?: TransformedField<10>
  }
)

expectType<TransformFormData<{ a: Field<10, { extra: '' }> }>>(
  {} as {
    a: TransformedField<10, { extra: '' }>
  }
)

expectType<
  TransformFormData<{
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
  TransformFormData<{
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
  TransformFormData<{
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
