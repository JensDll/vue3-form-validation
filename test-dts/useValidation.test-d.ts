import { expectType } from 'tsd'
import { ref, Ref } from 'vue'

import { Field, TransformedField, useValidation } from 'vue3-form-validation'

useValidation<{ a: Field<string> }>({
  a: {
    $value: ''
  }
})

useValidation<{ a: Field<string, { extra: string }> }>({
  a: {
    $value: '',
    extra: ''
  }
})

useValidation<{ a: Field<{ b: { c: Ref<string> } }> }>({
  a: {
    $value: {
      b: {
        c: ref('')
      }
    },
    $rules: [a => expectType<{ b: { c: string } }>(a)]
  }
})

// Allow maybe ref for $value
{
  useValidation<{ a: Field<string> }>({
    a: {
      $value: '',
      $rules: [a => expectType<string>(a)]
    }
  })

  useValidation<{ a: Field<string> }>({
    a: {
      $value: ref(''),
      $rules: [a => expectType<string>(a)]
    }
  })
}

// Example without generic
{
  const { form, validateFields, add } = useValidation({
    a: { $value: '', extra: '' },
    b: { $value: '' },
    cs: [{ d: { $value: 10, extra: '' } }]
  })

  expectType<{
    a: TransformedField<string, { extra: string }>
    b: TransformedField<string>
    cs: { d: TransformedField<number, { extra: string }> }[]
  }>(form)

  expectType<Promise<{ a: string; b: string; cs: { d: number }[] }>>(
    validateFields()
  )

  add(['cs'], { d: { $value: 10, extra: '' } })
  // @ts-expect-error
  add(['cs'], { d: { $value: 10 } })
  // @ts-expect-error
  add(['cs'], { d: { $value: '', extra: '' } })
}

// Example with generic
{
  const { form, validateFields, add } = useValidation<{
    a: Field<string, { extra: string }>
    b: Field<string>
    cs: { d: Field<number, { extra: string }> }[]
  }>({
    a: {
      $value: '',
      $rules: [a => expectType<string>(a)],
      extra: ''
    },
    b: {
      $value: '',
      $rules: [b => expectType<string>(b)]
    },
    cs: [
      {
        d: {
          $value: 10,
          $rules: [d => expectType<number>(d)],
          extra: ''
        }
      }
    ]
  })

  expectType<{
    a: TransformedField<string, { extra: string }>
    b: TransformedField<string>
    cs: { d: TransformedField<number, { extra: string }> }[]
  }>(form)

  expectType<Promise<{ a: string; b: string; cs: { d: number }[] }>>(
    validateFields()
  )

  add(['cs'], { d: { $value: 10, extra: '' } })
  // @ts-expect-error
  add(['cs'], { d: { $value: 10 } })
  // @ts-expect-error
  add(['cs'], { d: { $value: '' } })
}

// Example with optional fields
{
  const { form, validateFields } = useValidation<{
    a?: Field<string, { extra?: string }>
    b?: Field<string>
    cs?: { d?: Field<number, { extra?: string }> }[]
  }>({
    a: {
      $value: '',
      $rules: [a => expectType<string>(a)],
      extra: ''
    },
    b: {
      $value: '',
      $rules: [b => expectType<string>(b)]
    },
    cs: [
      {
        d: {
          $value: 10,
          $rules: [d => expectType<number>(d)],
          extra: ''
        }
      }
    ]
  })

  expectType<{
    a?: TransformedField<string, { extra?: string }>
    b?: TransformedField<string>
    cs?: { d?: TransformedField<number, { extra?: string }> }[]
  }>(form)

  expectType<Promise<{ a?: string; b?: string; cs?: { d?: number }[] }>>(
    validateFields()
  )
}

// Example with nested field
{
  const { form, validateFields } = useValidation<{
    a: Field<
      {
        xs: string[]
        y: number
      }[]
    >
  }>({
    a: {
      $value: ref([
        {
          xs: [],
          y: 10
        }
      ]),
      $rules: [
        as =>
          expectType<
            {
              xs: string[]
              y: number
            }[]
          >(as)
      ]
    }
  })

  expectType<{
    a: TransformedField<
      {
        xs: string[]
        y: number
      }[]
    >
  }>(form)

  expectType<
    Promise<{
      a: {
        xs: string[]
        y: number
      }[]
    }>
  >(validateFields())
}
