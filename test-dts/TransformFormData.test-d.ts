import { expectType } from 'tsd'
import { Ref } from 'vue'

import { MaybeRef } from 'shared'
import {
  TransformFormData,
  TransformedField,
  Field
} from 'vue3-form-validation'

// Testing without using the Field type

expectType<
  TransformFormData<{
    a: { $value: string }
  }>
>(
  {} as {
    a: TransformedField<string>
  }
)

expectType<
  TransformFormData<{
    a: { $value: MaybeRef<string> }
  }>
>(
  {} as {
    a: TransformedField<string>
  }
)

expectType<
  TransformFormData<{
    a: {
      $value: MaybeRef<string>
      extra: number
    }
  }>
>(
  {} as {
    a: TransformedField<string, { extra: number }>
  }
)

expectType<
  TransformFormData<{
    a: {
      $value: MaybeRef<string>
      extra: MaybeRef<number>
    }
  }>
>(
  {} as {
    a: TransformedField<string, { extra: number }>
  }
)

expectType<
  TransformFormData<{
    a: {
      bs: {
        c: {
          $value: MaybeRef<string>
        }
      }[]
    }
  }>
>(
  {} as {
    a: {
      bs: {
        c: TransformedField<string>
      }[]
    }
  }
)

expectType<
  TransformFormData<{
    a?: {
      bs?: {
        c?: {
          $value: MaybeRef<string>
        }
      }[]
    }
  }>
>(
  {} as {
    a?: {
      bs?: {
        c?: TransformedField<string>
      }[]
    }
  }
)

expectType<
  TransformFormData<{
    a?: {
      bs?: {
        c?: {
          $value: MaybeRef<string>
          extra?: MaybeRef<number>
        }
      }[]
    }
  }>
>(
  {} as {
    a?: {
      bs?: {
        c?: TransformedField<string, { extra?: number }>
      }[]
    }
  }
)

// Testing with using the Field type

expectType<
  TransformFormData<{
    a: Field<string>
  }>
>(
  {} as {
    a: TransformedField<string>
  }
)

expectType<
  TransformFormData<{
    a: Field<string, { extra: number }>
  }>
>(
  {} as {
    a: TransformedField<string, { extra: number }>
  }
)

expectType<
  TransformFormData<{
    a: Field<string, { extra: Ref<number> }>
  }>
>(
  {} as {
    a: TransformedField<string, { extra: number }>
  }
)

expectType<
  TransformFormData<{
    a: {
      bs: {
        c: Field<string>
      }[]
    }
  }>
>(
  {} as {
    a: {
      bs: {
        c: TransformedField<string>
      }[]
    }
  }
)

expectType<
  TransformFormData<{
    a?: {
      bs?: {
        c?: Field<string>
      }[]
    }
  }>
>(
  {} as {
    a?: {
      bs?: {
        c?: TransformedField<string>
      }[]
    }
  }
)

expectType<
  TransformFormData<{
    a?: {
      bs?: {
        c?: Field<string, { extra?: Ref<number> }>
      }[]
    }
  }>
>(
  {} as {
    a?: {
      bs?: {
        c?: TransformedField<string, { extra?: number }>
      }[]
    }
  }
)
