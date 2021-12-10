import { isArray, isDefined, isObject, isRecord } from '../src/typeGuards'

describe('isDefined', () => {
  it('null -> false', () => {
    expect(isDefined(null)).toBe(false)
  })

  it('undefined -> false', () => {
    expect(isDefined(void 0)).toBe(false)
  })

  it('any -> true', () => {
    expect(isDefined(0)).toBe(true)
  })
})

describe('isArray', () => {
  it('null -> false', () => {
    expect(isArray(null)).toBe(false)
  })

  it('{} -> false', () => {
    expect(isArray({})).toBe(false)
  })

  it('[] -> true', () => {
    expect(isArray([])).toBe(true)
  })
})

describe('isRecord', () => {
  it('null -> false', () => {
    expect(isRecord(null)).toBe(false)
  })

  it('[] -> false', () => {
    expect(isRecord([])).toBe(false)
  })

  it('{} -> true', () => {
    expect(isRecord({})).toBe(true)
  })
})

describe('isObject', () => {
  it('null -> false', () => {
    expect(isObject(null)).toBe(false)
  })

  it('[] -> true', () => {
    expect(isObject([])).toBe(true)
  })

  it('{} -> true', () => {
    expect(isObject({})).toBe(true)
  })
})
