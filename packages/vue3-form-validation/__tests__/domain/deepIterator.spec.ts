import { ref } from 'vue'
import { deepIterator } from '../../src/domain'

it('should iterate correctly for basic objects', () => {
  const obj = {
    a: 1,
    b: 2,
    c: 3
  }

  const it = deepIterator(obj)

  expect(it.next().value).toStrictEqual(['a', obj.a, obj, ['a'], true])
  expect(it.next().value).toStrictEqual(['b', obj.b, obj, ['b'], true])
  expect(it.next().value).toStrictEqual(['c', obj.c, obj, ['c'], true])
  expect(it.next().done).toBe(true)
})

it('should iterate correctly for basic nested objects', () => {
  const obj = {
    a: 1,
    b: {
      c: 2,
      d: {
        e: {},
        f: []
      }
    }
  }

  const it = deepIterator(obj)

  expect(it.next().value).toStrictEqual(['a', obj.a, obj, ['a'], true])
  expect(it.next().value).toStrictEqual(['b', obj.b, obj, ['b'], false])
  expect(it.next().value).toStrictEqual(['c', obj.b.c, obj.b, ['b', 'c'], true])
  expect(it.next().value).toStrictEqual([
    'd',
    obj.b.d,
    obj.b,
    ['b', 'd'],
    false
  ])
  expect(it.next().value).toStrictEqual([
    'e',
    obj.b.d.e,
    obj.b.d,
    ['b', 'd', 'e'],
    true
  ])
  expect(it.next().value).toStrictEqual([
    'f',
    obj.b.d.f,
    obj.b.d,
    ['b', 'd', 'f'],
    true
  ])
  expect(it.next().done).toBe(true)
})

it('should iterate correctly for nested objects with arrays', () => {
  const obj = {
    a: 1,
    bs: [
      {
        c: 2,
        d: {
          e: 3
        }
      },
      {
        c: 2,
        d: {
          e: 3
        }
      }
    ]
  } as const

  const it = deepIterator(obj)

  expect(it.next().value).toStrictEqual(['a', obj.a, obj, ['a'], true])
  expect(it.next().value).toStrictEqual(['bs', obj.bs, obj, ['bs'], false])
  expect(it.next().value).toStrictEqual([
    '0',
    obj.bs[0],
    obj.bs,
    ['bs', '0'],
    false
  ])
  expect(it.next().value).toStrictEqual([
    'c',
    obj.bs[0].c,
    obj.bs[0],
    ['bs', '0', 'c'],
    true
  ])
  expect(it.next().value).toStrictEqual([
    'd',
    obj.bs[0].d,
    obj.bs[0],
    ['bs', '0', 'd'],
    false
  ])
  expect(it.next().value).toStrictEqual([
    'e',
    obj.bs[0].d.e,
    obj.bs[0].d,
    ['bs', '0', 'd', 'e'],
    true
  ])
  expect(it.next().value).toStrictEqual([
    '1',
    obj.bs[1],
    obj.bs,
    ['bs', '1'],
    false
  ])
  expect(it.next().value).toStrictEqual([
    'c',
    obj.bs[1].c,
    obj.bs[1],
    ['bs', '1', 'c'],
    true
  ])
  expect(it.next().value).toStrictEqual([
    'd',
    obj.bs[1].d,
    obj.bs[1],
    ['bs', '1', 'd'],
    false
  ])
  expect(it.next().value).toStrictEqual([
    'e',
    obj.bs[1].d.e,
    obj.bs[1].d,
    ['bs', '1', 'd', 'e'],
    true
  ])
  expect(it.next().done).toBe(true)
})

it("should not iterate over ref's", () => {
  const obj = {
    a: ref(1),
    bs: [
      {
        c: 2,
        d: {
          e: 3
        }
      },
      {
        c: 2,
        d: {
          e: ref(3)
        }
      }
    ]
  } as const

  const it = deepIterator(obj)

  expect(it.next().value).toStrictEqual(['a', obj.a, obj, ['a'], true])
  expect(it.next().value).toStrictEqual(['bs', obj.bs, obj, ['bs'], false])
  expect(it.next().value).toStrictEqual([
    '0',
    obj.bs[0],
    obj.bs,
    ['bs', '0'],
    false
  ])
  expect(it.next().value).toStrictEqual([
    'c',
    obj.bs[0].c,
    obj.bs[0],
    ['bs', '0', 'c'],
    true
  ])
  expect(it.next().value).toStrictEqual([
    'd',
    obj.bs[0].d,
    obj.bs[0],
    ['bs', '0', 'd'],
    false
  ])
  expect(it.next().value).toStrictEqual([
    'e',
    obj.bs[0].d.e,
    obj.bs[0].d,
    ['bs', '0', 'd', 'e'],
    true
  ])
  expect(it.next().value).toStrictEqual([
    '1',
    obj.bs[1],
    obj.bs,
    ['bs', '1'],
    false
  ])
  expect(it.next().value).toStrictEqual([
    'c',
    obj.bs[1].c,
    obj.bs[1],
    ['bs', '1', 'c'],
    true
  ])
  expect(it.next().value).toStrictEqual([
    'd',
    obj.bs[1].d,
    obj.bs[1],
    ['bs', '1', 'd'],
    false
  ])
  expect(it.next().value).toStrictEqual([
    'e',
    obj.bs[1].d.e,
    obj.bs[1].d,
    ['bs', '1', 'd', 'e'],
    true
  ])
  expect(it.next().done).toBe(true)
})

it('passing a predicate should stop the traversal', () => {
  const obj = {
    a: {
      $: ''
    },
    b: {
      c: 10,
      d: {
        $: ''
      }
    }
  }

  const it = deepIterator(obj, value => value !== null && '$' in value)

  expect(it.next().value).toStrictEqual(['a', obj.a, obj, ['a'], true])
  expect(it.next().value).toStrictEqual(['b', obj.b, obj, ['b'], false])
  expect(it.next().value).toStrictEqual(['c', obj.b.c, obj.b, ['b', 'c'], true])
  expect(it.next().value).toStrictEqual(['d', obj.b.d, obj.b, ['b', 'd'], true])
  expect(it.next().done).toBe(true)
})
