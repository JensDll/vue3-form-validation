import { expectType, expectError } from 'tsd'
import { ref, Ref } from 'vue'
import {
  Field,
  TransformedField
} from '../packages/vue3-form-validation/src/form'
import { useValidation } from '../packages/vue3-form-validation/src/useValidation'

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
        c: ref('')
      }
    },
    // unpack refs in rules (nested)
    $rules: [a => expectType<{ b: { c: string } }>(a)]
  }
})

// example without generic
{
  const { form, validateFields, add } = useValidation({
    a: { $value: '' },
    b: { $value: '' },
    cs: [{ d: { $value: 10 } }]
  })

  expectType<{
    a: TransformedField<string>
    b: TransformedField<string>
    cs: { d: TransformedField<number> }[]
  }>(form)

  expectType<Promise<{ a: string; b: string; cs: { d: number }[] }>>(
    validateFields()
  )

  add(['cs'], { d: { $value: 10 } })
  expectError(add(['cs'], { d: { $value: '' } }))
}

// example with generic
{
  const { form, validateFields, add } = useValidation<{
    a: Field<string>
    b: Field<string>
    cs: { d: Field<number> }[]
  }>({
    a: {
      $value: '',
      $rules: [a => expectType<string>(a)]
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
    a: TransformedField<string>
    b: TransformedField<string>
    cs: { d: TransformedField<number> }[]
  }>(form)

  expectType<Promise<{ a: string; b: string; cs: { d: number }[] }>>(
    validateFields()
  )

  add(['cs'], { d: { $value: 10 } })
  expectError(add(['cs'], { d: { $value: '' } }))
}

// example with nested field
{
  const { form, validateFields } = useValidation<{
    a: Field<
      {
        xs: string[]
        y: Ref<number>
      }[]
    >
  }>({
    a: {
      $value: [
        {
          xs: [],
          y: ref(10)
        }
      ],
      $rules: [
        as =>
          expectType<
            {
              xs: string[]
              y: Ref<number>
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
    a: Field<string>
    b?: Field<boolean>
    c?: Field<number>
  }>({
    a: {
      $value: '',
      $rules: [x => expect<string>(x)]
    },
    b: {
      $value: false,
      $rules: [x => expect<boolean>(x)]
    },
    c: {
      $value: 0,
      $rules: [x => expect<number>(x)]
    }
  })

  expectType<{
    a: TransformedField<string>
    b?: TransformedField<boolean>
    c?: TransformedField<number>
  }>(form)

  expectType<
    Promise<{
      a: string
      b?: boolean
      c?: number
    }>
  >(validateFields())

  add(['a'], { $value: '' })
  add(['b'], { $value: false })
  add(['c'], { $value: 0 })
  expectError(add(['a'], { $value: null }))
  expectError(add(['b'], { $value: null }))
  expectError(add(['c'], { $value: null }))
}
