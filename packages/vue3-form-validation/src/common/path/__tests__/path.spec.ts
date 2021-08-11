import { path } from '../path'

type TestObject = {
  a: number
  b: {
    c: number
    ds: {
      e: number
      f: number
      gs: {
        h: number
      }[]
    }[]
  }
  is: {
    j: number
    k: number
  }[]
}

let foo: TestObject

beforeEach(() => {
  foo = {
    a: 1,
    b: {
      c: 2,
      ds: [
        {
          e: 3,
          f: 4,
          gs: [
            {
              h: 5
            },
            {
              h: 6
            }
          ]
        }
      ]
    },
    is: [
      {
        j: 7,
        k: 8
      }
    ]
  }
})

it('should work for nested paths', () => {
  expect(path(['a'], foo)).toBe(1)
  expect(path(['b', 'c'], foo)).toBe(2)
  expect(path(['b', 'ds', 0, 'e'], foo)).toBe(3)
  expect(path(['b', 'ds', 0, 'f'], foo)).toBe(4)
  expect(path(['b', 'ds', 0, 'gs', 0, 'h'], foo)).toBe(5)
  expect(path(['b', 'ds', 0, 'gs', 1, 'h'], foo)).toBe(6)
  expect(path(['is', 0, 'j'], foo)).toBe(7)
  expect(path(['is', 0, 'k'], foo)).toBe(8)
})

it("should be undefined for path's that don't exist", () => {
  expect(path([], foo)).toBe(undefined)
  expect(path(['x'], foo)).toBe(undefined)
  expect(path(['a', 'x'], foo)).toBe(undefined)
  expect(path(['b', 'x'], foo)).toBe(undefined)
  expect(path(['b', 'ds', 1], foo)).toBe(undefined)
  expect(path(['b', 'ds', 0, 'x'], foo)).toBe(undefined)
  expect(path(['b', 'ds', 0, 'gs', 10], foo)).toBe(undefined)
  expect(path(['b', 'ds', 0, 'gs', 20], foo)).toBe(undefined)
  expect(path(['b', 'ds', 0, 'gs', 0, 'x'], foo)).toBe(undefined)
  expect(path(['b', 'ds', 0, 'gs', 1, 'x'], foo)).toBe(undefined)
  expect(path(['is', 0, 'x'], foo)).toBe(undefined)
})
