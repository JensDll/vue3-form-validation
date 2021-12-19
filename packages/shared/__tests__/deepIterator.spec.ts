import { ref } from 'vue-demi'

import { deepIterator } from '../src/deepIterator'

it('should iterate correctly for basic objects', () => {
  const obj = {
    a: 1,
    b: 2,
    c: 3
  }

  const it = deepIterator(obj)

  expect(it.next().value).toStrictEqual({
    key: 'a',
    value: obj.a,
    parent: obj,
    path: ['a'],
    isLeaf: true
  })
  expect(it.next().value).toStrictEqual({
    key: 'b',
    value: obj.b,
    parent: obj,
    path: ['b'],
    isLeaf: true
  })
  expect(it.next().value).toStrictEqual({
    key: 'c',
    value: obj.c,
    parent: obj,
    path: ['c'],
    isLeaf: true
  })
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

  expect(it.next().value).toStrictEqual({
    key: 'a',
    value: obj.a,
    parent: obj,
    path: ['a'],
    isLeaf: true
  })
  expect(it.next().value).toStrictEqual({
    key: 'b',
    value: obj.b,
    parent: obj,
    path: ['b'],
    isLeaf: false
  })
  expect(it.next().value).toStrictEqual({
    key: 'c',
    value: obj.b.c,
    parent: obj.b,
    path: ['b', 'c'],
    isLeaf: true
  })
  expect(it.next().value).toStrictEqual({
    key: 'd',
    value: obj.b.d,
    parent: obj.b,
    path: ['b', 'd'],
    isLeaf: false
  })
  expect(it.next().value).toStrictEqual({
    key: 'e',
    value: obj.b.d.e,
    parent: obj.b.d,
    path: ['b', 'd', 'e'],
    isLeaf: true
  })
  expect(it.next().value).toStrictEqual({
    key: 'f',
    value: obj.b.d.f,
    parent: obj.b.d,
    path: ['b', 'd', 'f'],
    isLeaf: true
  })
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

  expect(it.next().value).toStrictEqual({
    key: 'a',
    value: obj.a,
    parent: obj,
    path: ['a'],
    isLeaf: true
  })
  expect(it.next().value).toStrictEqual({
    key: 'bs',
    value: obj.bs,
    parent: obj,
    path: ['bs'],
    isLeaf: false
  })
  expect(it.next().value).toStrictEqual({
    key: '0',
    value: obj.bs[0],
    parent: obj.bs,
    path: ['bs', '0'],
    isLeaf: false
  })
  expect(it.next().value).toStrictEqual({
    key: 'c',
    value: obj.bs[0].c,
    parent: obj.bs[0],
    path: ['bs', '0', 'c'],
    isLeaf: true
  })
  expect(it.next().value).toStrictEqual({
    key: 'd',
    value: obj.bs[0].d,
    parent: obj.bs[0],
    path: ['bs', '0', 'd'],
    isLeaf: false
  })
  expect(it.next().value).toStrictEqual({
    key: 'e',
    value: obj.bs[0].d.e,
    parent: obj.bs[0].d,
    path: ['bs', '0', 'd', 'e'],
    isLeaf: true
  })
  expect(it.next().value).toStrictEqual({
    key: '1',
    value: obj.bs[1],
    parent: obj.bs,
    path: ['bs', '1'],
    isLeaf: false
  })
  expect(it.next().value).toStrictEqual({
    key: 'c',
    value: obj.bs[1].c,
    parent: obj.bs[1],
    path: ['bs', '1', 'c'],
    isLeaf: true
  })
  expect(it.next().value).toStrictEqual({
    key: 'd',
    value: obj.bs[1].d,
    parent: obj.bs[1],
    path: ['bs', '1', 'd'],
    isLeaf: false
  })
  expect(it.next().value).toStrictEqual({
    key: 'e',
    value: obj.bs[1].d.e,
    parent: obj.bs[1].d,
    path: ['bs', '1', 'd', 'e'],
    isLeaf: true
  })
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

  expect(it.next().value).toStrictEqual({
    key: 'a',
    value: obj.a,
    parent: obj,
    path: ['a'],
    isLeaf: true
  })
  expect(it.next().value).toStrictEqual({
    key: 'bs',
    value: obj.bs,
    parent: obj,
    path: ['bs'],
    isLeaf: false
  })
  expect(it.next().value).toStrictEqual({
    key: '0',
    value: obj.bs[0],
    parent: obj.bs,
    path: ['bs', '0'],
    isLeaf: false
  })
  expect(it.next().value).toStrictEqual({
    key: 'c',
    value: obj.bs[0].c,
    parent: obj.bs[0],
    path: ['bs', '0', 'c'],
    isLeaf: true
  })
  expect(it.next().value).toStrictEqual({
    key: 'd',
    value: obj.bs[0].d,
    parent: obj.bs[0],
    path: ['bs', '0', 'd'],
    isLeaf: false
  })
  expect(it.next().value).toStrictEqual({
    key: 'e',
    value: obj.bs[0].d.e,
    parent: obj.bs[0].d,
    path: ['bs', '0', 'd', 'e'],
    isLeaf: true
  })
  expect(it.next().value).toStrictEqual({
    key: '1',
    value: obj.bs[1],
    parent: obj.bs,
    path: ['bs', '1'],
    isLeaf: false
  })
  expect(it.next().value).toStrictEqual({
    key: 'c',
    value: obj.bs[1].c,
    parent: obj.bs[1],
    path: ['bs', '1', 'c'],
    isLeaf: true
  })
  expect(it.next().value).toStrictEqual({
    key: 'd',
    value: obj.bs[1].d,
    parent: obj.bs[1],
    path: ['bs', '1', 'd'],
    isLeaf: false
  })
  expect(it.next().value).toStrictEqual({
    key: 'e',
    value: obj.bs[1].d.e,
    parent: obj.bs[1].d,
    path: ['bs', '1', 'd', 'e'],
    isLeaf: true
  })
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

  expect(it.next().value).toStrictEqual({
    key: 'a',
    value: obj.a,
    parent: obj,
    path: ['a'],
    isLeaf: true
  })
  expect(it.next().value).toStrictEqual({
    key: 'b',
    value: obj.b,
    parent: obj,
    path: ['b'],
    isLeaf: false
  })
  expect(it.next().value).toStrictEqual({
    key: 'c',
    value: obj.b.c,
    parent: obj.b,
    path: ['b', 'c'],
    isLeaf: true
  })
  expect(it.next().value).toStrictEqual({
    key: 'd',
    value: obj.b.d,
    parent: obj.b,
    path: ['b', 'd'],
    isLeaf: true
  })
  expect(it.next().done).toBe(true)
})
