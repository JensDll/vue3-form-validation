import { expectType, expectError } from 'tsd';
import { ref, Ref } from 'vue';
import {
  Field,
  TransformedField,
  useValidation
} from '../composition/useValidation';

useValidation<{ a: Field<string> }>({
  a: {
    $value: '',
    // infer type when generic is given
    $rules: [a => expectType<string>(a)]
  }
});

useValidation<{ a: Field<string> }>({
  a: {
    $value: ref(''),
    // unpack refs in rules
    $rules: [a => expectType<string>(a)]
  }
});

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
});

// complete example without generic
{
  const { form, validateFields, add } = useValidation({
    a: { $value: '' },
    b: { $value: '' },
    cs: [{ d: { $value: 10 } }]
  });

  expectType<{
    a: TransformedField<string>;
    b: TransformedField<string>;
    cs: { d: TransformedField<number> }[];
  }>(form);

  expectType<Promise<{ a: string; b: string; cs: { d: number }[] }>>(
    validateFields()
  );

  add(['cs'], { d: { $value: 10 } });
  expectError(add(['cs'], { d: { $value: '' } }));
}

// complete example with generic
{
  const { form, validateFields, add } = useValidation<{
    a: Field<string>;
    b: Field<string>;
    cs: { d: Field<number> }[];
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
  });

  expectType<{
    a: TransformedField<string>;
    b: TransformedField<string>;
    cs: { d: TransformedField<number> }[];
  }>(form);

  expectType<Promise<{ a: string; b: string; cs: { d: number }[] }>>(
    validateFields()
  );

  add(['cs'], { d: { $value: 10 } });
  expectError(add(['cs'], { d: { $value: '' } }));
}

{
  const { form, validateFields } = useValidation<{
    a: Field<
      {
        xs: string[];
        y: Ref<number>;
      }[]
    >;
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
              xs: string[];
              y: Ref<number>;
            }[]
          >(as) // no ref unwrapping in array
      ]
    }
  });

  expectType<{
    a: TransformedField<
      {
        xs: string[];
        y: number;
      }[]
    >;
  }>(form);

  expectType<
    Promise<{
      a: {
        xs: string[];
        y: number;
      }[];
    }>
  >(validateFields());
}
