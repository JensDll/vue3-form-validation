import { Field, TransformedField } from '../composition/useValidation'
import { Key } from './types'

export type SimpleRule<T = any> = (value: T) => any
export type KeyedRule = {
  key: string
  rule?: (...values: any[]) => any
}
export type Rule<T = any> = SimpleRule<T> | KeyedRule

export const isDefined = <T>(x: T | null | undefined): x is T =>
  x !== null && typeof x !== 'undefined'

export const isRecord = (x: unknown): x is Record<Key, any> =>
  typeof x === 'object' && x !== null && !Array.isArray(x)

export const isArray = (x: unknown): x is any[] => Array.isArray(x)

export const isObject = (x: unknown): x is Record<Key, any> =>
  typeof x === 'object' && x !== null

export const isField = <T>(x: unknown): x is Field<T> =>
  isRecord(x) ? '$value' in x : false

export const isTransformedField = <T>(x: unknown): x is TransformedField<T> =>
  isRecord(x)
    ? '$uid' in x && '$value' in x && '$errors' in x && '$validating' in x
    : false

export const isSimpleRule = (rule: Rule): rule is SimpleRule =>
  typeof rule === 'function'
