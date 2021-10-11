import * as n_domain from '../domain'
import { Field, TransformedField } from './types/data'
import { SimpleRule, RuleWithKey } from './types/rules'

export const isField = <T>(x: unknown): x is Field<T> =>
  n_domain.isRecord(x) ? '$value' in x : false

export const isTransformedField = <T>(x: unknown): x is TransformedField<T> =>
  n_domain.isRecord(x) ? '$uid' in x && '$value' in x : false

export const isSimpleRule = (
  rule: SimpleRule | RuleWithKey
): rule is SimpleRule => typeof rule === 'function'
