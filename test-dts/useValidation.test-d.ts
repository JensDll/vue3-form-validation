import { expectType, expectError } from 'tsd'
import { ref } from 'vue'

import { Field, TransformedField } from 'vue3-form-validation/src/form'
import { useValidation } from 'vue3-form-validation/src/useValidation'

useValidation<{ a: Field<string> }>({
  a: {
    $value: ''
  }
})

useValidation<{ a: Field<string, { extra: '' }> }>({
  a: {
    $value: '',
    extra: ''
  }
})

useValidation<{ a: Field<string> }>({
  a: {
    $value: '',
    // infer type when generic is given
    $rules: [a => expectType<string>(a)]
  }
})

useValidation<{ a: Field<string> }>({
  a: {
    $value: ref(''),
    // unpack refs in rules
    $rules: [a => expectType<string>(a)]
  }
})

useValidation<{ a: Field<{ b: { c: string } }> }>({
  a: {
    $value: {
      b: {
        c: ''
      }
    },
    // unpack refs in rules (nested)
    $rules: [a => expectType<{ b: { c: string } }>(a)]
  }
})

// example without generic
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
  add(['cs'], { d: { $value: '' } })
}

// example with generic
{
  const { form, validateFields, add } = useValidation<{
    a: Field<string, { extra: '' }>
    b: Field<string>
    cs: { d: Field<number> }[]
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
          $rules: [d => expectType<number>(d)]
        }
      }
    ]
  })

  expectType<{
    a: TransformedField<string, { extra: '' }>
    b: TransformedField<string>
    cs: { d: TransformedField<number> }[]
  }>(form)

  expectType<Promise<{ a: string; b: string; cs: { d: number }[] }>>(
    validateFields()
  )

  add(['cs'], { d: { $value: 10 } })
  // @ts-expect-error
  add(['cs'], { d: { $value: '' } })
}

// example with nested field
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
          >(as) // no ref unwrapping in array
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

// example with optional fields
{
  const { form, validateFields, add } = useValidation<{
    a: Field<string, { extra: string }>
    b?: Field<boolean, { stuff: '' }>
    c?: Field<number>
  }>({
    a: {
      $value: '',
      $rules: [x => expect<string>(x)],
      extra: ''
    },
    b: {
      $value: false,
      $rules: [x => expect<boolean>(x)],
      stuff: ''
    },
    c: {
      $value: 0,
      $rules: [x => expect<number>(x)]
    }
  })

  expectType<{
    a: TransformedField<string, { extra: string }>
    b?: TransformedField<boolean, { stuff: '' }>
    c?: TransformedField<number>
  }>(form)

  expectType<
    Promise<{
      a: string
      b?: boolean
      c?: number
    }>
  >(validateFields())

  add(['a'], { $value: '', extra: '' })
  add(['b'], { $value: false, stuff: '' })
  add(['c'], { $value: 0 })
  expectError(add(['a'], { $value: null, extra: '' }))
  expectError(add(['b'], { $value: null, stuff: '' }))
  expectError(add(['c'], { $value: null }))
}
