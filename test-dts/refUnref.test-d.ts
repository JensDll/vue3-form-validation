import { expectType } from 'tsd';
import { Ref } from 'vue';
import { RefUnref } from '../packages/vue3-form-validation/types/refUnref';

type RU1 = RefUnref<{ a: string }>;
type RU1_Expected = { a: Ref<string> | string };

expectType<RU1_Expected>({} as RU1);

type RU2 = RefUnref<{ a: string[] }>;
type RU2_Expected = { a: string[] | Ref<string[]> };

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

type RU4 = RefUnref<string[]>;
type RU4_Expected = string[] | Ref<string[]>;

expectType<RU4_Expected>({} as RU4);

type RU5 = RefUnref<string>;
type RU5_Expected = string | Ref<string>;

expectType<RU5_Expected>({} as RU5);

type RU6 = RefUnref<{ a: { b: Ref<string> }[] }>;
type RU6_Expected = { a: { b: Ref<string> }[] | Ref<{ b: Ref<string> }[]> };

expectType<RU6_Expected>({} as RU6);
