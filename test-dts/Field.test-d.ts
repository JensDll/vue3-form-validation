import { expectType } from 'tsd'
import { Ref } from 'vue'
import {
  Field,
  Rule
} from '../packages/vue3-form-validation/src/composition/useValidation'

type FL1 = Field<string>
type FL1_Expected = { $value: string | Ref<string>; $rules?: Rule<string>[] }

expectType<FL1_Expected>({} as FL1)

type FL2 = Field<Ref<string>>
type FL2_Expected = { $value: string | Ref<string>; $rules?: Rule<string>[] }

expectType<FL2_Expected>({} as FL2)

type FL3 = Field<{ a: { b: string } }>
type FL3_Expected = {
  $value: { a: { b: string | Ref<string> } }
  $rules?: Rule<{ a: { b: string } }>[]
}

expectType<FL3_Expected>({} as FL3)

type FL4 = Field<{ a: { b: Ref<string> } }>
type FL4_Expected = {
  $value: { a: { b: string | Ref<string> } }
  $rules?: Rule<{ a: { b: string } }>[]
}

expectType<FL4_Expected>({} as FL4)

type FL5 = Field<string[]>
type FL5_Expected = {
  $value: string[] | Ref<string[]>
  $rules?: Rule<string[]>[]
}

expectType<FL5_Expected>({} as FL5)

type FL6 = Field<{
  as: string[]
  b: Ref<string>
}>
type FL6_Expected = {
  $value: {
    as: string[] | Ref<string[]>
    b: string | Ref<string>
  }
  $rules?: Rule<{
    as: string[]
    b: string
  }>[]
}

expectType<FL6_Expected>({} as FL6)

type FL7 = Field<{ a: Ref<string> }[]>
type FL7_Expected = {
  $value: { a: Ref<string> }[] | Ref<{ a: Ref<string> }[]>
  $rules?: Rule<{ a: Ref<string> }[]>[]
}

expectType<FL7_Expected>({} as FL7)
