import { expectType, expectError } from 'tsd';
import { ref, Ref } from 'vue';
import {
  RefUnref,
  Field,
  Rule,
  ValidateInput,
  TransformedField,
  useValidation
} from '../main/composable/useValidation';

// ========== RefUnref (RU) ==========
type RU1 = RefUnref<{ a: string }>;
type RU1_Expected = { a: Ref<string> | string };

expectType<RU1_Expected>({} as RU1);

type RU2 = RefUnref<{ a: string }[]>;
type RU2_Expected = { a: Ref<string> | string }[];

expectType<RU2_Expected>({} as RU2);

type RU3 = RefUnref<{
  a: string;
  b: {
    c: number;
  };
}>;
type RU3_Expected = {
  a: Ref<string> | string;
  b: {
    c: Ref<number> | number;
  };
};

expectType<RU3_Expected>({} as RU3);

// ========== Field (FL) ==========
type FL1 = Field<string>;
type FL1_Expected = { $value: string | Ref<string>; $rules?: Rule<string>[] };

expectType<FL1_Expected>({} as FL1);

type FL2 = Field<Ref<string>>;
type FL2_Expected = { $value: string | Ref<string>; $rules?: Rule<string>[] };

expectType<FL2_Expected>({} as FL2);

type FL3 = Field<{ a: { b: string } }>;
type FL3_Expected = {
  $value: { a: { b: string | Ref<string> } };
  $rules?: Rule<{ a: { b: string } }>[];
};

expectType<FL3_Expected>({} as FL3);

type FL4 = Field<{ a: { b: Ref<string> } }>;
type FL4_Expected = {
  $value: { a: { b: string | Ref<string> } };
  $rules?: Rule<{ a: { b: string } }>[];
};

expectType<FL4_Expected>({} as FL4);

// ========== ValidateInput (VI) ==========
type VI1 = ValidateInput<{ a: Field<string> }>;
type VI1_Expected = { a: Field<string | Ref<string>> };

expectType<VI1_Expected>({} as VI1);

type VI2 = ValidateInput<{ a: Field<Ref<string>> }>;
type VI2_Expected = { a: Field<string | Ref<string>> };

expectType<VI2_Expected>({} as VI2);

// more complex nested type
type VI3 = ValidateInput<{
  a: Field<string>;
  b: { c: Field<string> };
  ds: { e: { f: Field<{ g: { h: number } }> } }[];
}>;
type VI3_Expected = {
  a: Field<string | Ref<string>>;
  b: { c: Field<string | Ref<string>> };
  ds: { e: { f: Field<{ g: { h: number | Ref<number> } }> } }[];
};

expectType<VI3_Expected>({} as VI3);

// more complex nested type with refs (expected type should be the same!)
type VI4 = ValidateInput<{
  a: Field<Ref<string>>;
  b: { c: Field<Ref<string>> };
  ds: { e: { f: Field<{ g: { h: Ref<number> } }> } }[];
}>;
type VI4_Expected = {
  a: Field<string | Ref<string>>;
  b: { c: Field<string | Ref<string>> };
  ds: { e: { f: Field<{ g: { h: number | Ref<number> } }> } }[];
};

expectType<VI4_Expected>({} as VI4);

// ========== useValidation (UV) ==========
expectError(
  useValidation({
    a: {
      $value: '',
      // make sure you can't assign wrong type
      $rules: [(a: number) => a]
    }
  })
);

useValidation({
  a: {
    $value: {
      b: {
        c: ''
      }
    },
    // make sure you can assign correct type
    $rules: [(a: { b: { c: string } }) => expectType<{ b: { c: string } }>(a)]
  }
});

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

// Complete example (without generic)
void function () {
  const { form, validateFields, add, remove } = useValidation({
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
  expectError(add(['cs!'], { d: { $value: 10 } }));

  remove(['cs'], 0);
  expectError(remove(['cs'], ''));
  expectError(remove(['cs!'], 0));
};

// Complete example (with generic)
void function () {
  const { form, validateFields, add, remove } = useValidation<{
    a: Field<string>;
    b: Field<string>;
    cs: { d: Field<number> }[];
  }>({
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
  expectError(add(['cs!'], { d: { $value: 10 } }));

  remove(['cs'], 0);
  expectError(remove(['cs'], ''));
  expectError(remove(['cs!'], 0));
};
