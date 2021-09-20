import { deepCopy } from '../deepCopy'

it('should copy nested object and leave no reference', () => {
  const original = {
    a: 1,
    b: 2,
    c: {
      d: 3,
      e: [4, 5, 6]
    }
  }
  const jsonCopy = JSON.parse(JSON.stringify(original))

  const copy = deepCopy(original)
  original.c.d = 10
  original.c.e[0] = 10

  expect(jsonCopy).toStrictEqual(copy)
})
