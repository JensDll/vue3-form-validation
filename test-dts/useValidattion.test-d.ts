import { expectType, expectError } from 'tsd';
import { ref, Ref } from 'vue';
import {
  RefUnref,
  Field,
  Rule,
  TransformedField,
  useValidation
} from '../main/composition/useValidation';

// ========== RefUnref (RU) ==========
type RU1 = RefUnref<{ a: string }>;
type RU1_Expected = { a: Ref<string> | string };

expectType<RU1_Expected>({} as RU1);

type RU2 = RefUnref<{ a: string[] }>;
type RU2_Expected = { a: string[] };

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

type FL5 = Field<string[]>;
type FL5_Expected = { $value: string[]; $rules?: Rule<string[]>[] };

expectType<FL5_Expected>({} as FL5);

type FL6 = Field<{
  as: string[];
  b: Ref<string>;
}>;
type FL6_Expected = {
  $value: {
    as: string[];
    b: string | Ref<string>;
  };
  $rules?: Rule<{
    as: string[];
    b: string;
  }>[];
};

expectType<FL6_Expected>({} as FL6);

// ========== useValidation (UV) ==========
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
  expectError(add(['cs!'], { d: { $value: 10 } }));

  remove(['cs'], 0);
  expectError(remove(['cs'], ''));
  expectError(remove(['cs!'], 0));
};

void function () {
  const { form, validateFields } = useValidation<{
    a: Field<{
      xs: string[];
      y: Ref<number>;
    }>;
  }>({
    a: {
      $value: {
        xs: [],
        y: 10
      },
      $rules: [
        as =>
          expectType<{
            xs: string[];
            y: number;
          }>(as)
      ]
    }
  });

  expectType<{
    a: TransformedField<{
      xs: string[];
      y: number;
    }>;
  }>(form);

  expectType<
    Promise<{
      a: {
        xs: string[];
        y: number;
      };
    }>
  >(validateFields());
};
