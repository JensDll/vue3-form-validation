import { set } from '../set'

it('should create new properties', () => {
  const obj = {}

  set(obj, ['a'], 1)

  expect(obj).toStrictEqual({ a: 1 })
})

it('should create new nested properties', () => {
  const obj = {}

  set(obj, ['a', 'b'], 1)

  expect(obj).toStrictEqual({ a: { b: 1 } })
})

it('should keep existing properties', () => {
  const obj = {
    a: 'a',
    b: {
      c: 'c'
    }
  }

  set(obj, ['b', 'd'], 'd')
  set(obj, ['e'], 'e')

  expect(obj).toStrictEqual({
    a: 'a',
    b: {
      c: 'c',
      d: 'd'
    },
    e: 'e'
  })
})

describe('Arrays', () => {
  it('should create new nested properties', () => {
    const obj: any[] = []

    set(obj, ['0', 'a'], 1)
    set(obj, ['1', 'a'], 2)
    expect(obj).toStrictEqual([{ a: 1 }, { a: 2 }])
  })

  it('should create array if the path ends with a number', () => {
    const obj = {}

    set(obj, ['a', '0'], 1)

    expect(obj).toStrictEqual({ a: [1] })
  })

  it('should create array if the path contains a number', () => {
    const obj = {}

    set(obj, ['a', '0', 'a'], 1)

    expect(obj).toStrictEqual({ a: [{ a: 1 }] })
  })

  it('should create nested arrays', () => {
    const obj = {}

    set(obj, ['a', 0, 'a', 0], 1)

    expect(obj).toStrictEqual({ a: [{ a: [1] }] })
  })

  it('should keep existing arrays', () => {
    const obj = {}

    set(obj, ['a', 0, 'a', 0], 1)
    set(obj, ['a', 0, 'a', 1], 2)
    set(obj, ['a', 0, 'a', 2], 3)
    set(obj, ['a', 0, 'a', 3], 4)

    set(obj, ['b', 0, 'b', 0], 1)
    set(obj, ['b', 0, 'b', 1], 2)
    set(obj, ['b', 0, 'b', 2], 3)
    set(obj, ['b', 0, 'b', 3], 4)

    expect(obj).toStrictEqual({
      a: [{ a: [1, 2, 3, 4] }],
      b: [{ b: [1, 2, 3, 4] }]
    })

    set(obj, ['b'], [])

    expect(obj).toStrictEqual({
      a: [{ a: [1, 2, 3, 4] }],
      b: []
    })
  })
})
