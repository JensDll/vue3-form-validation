import { Key } from './types'

export const isDefined = <T>(x: T | null | undefined): x is T =>
  x !== null && x !== undefined

export const isRecord = (x: unknown): x is Record<Key, any> =>
  typeof x === 'object' && x !== null && !Array.isArray(x)

export const isArray = (x: unknown): x is any[] => Array.isArray(x)

export const isObject = (x: unknown): x is Record<Key, any> =>
  typeof x === 'object' && x !== null
