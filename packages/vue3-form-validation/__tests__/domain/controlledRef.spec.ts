import { ref, watch, nextTick } from 'vue'

import { makeMocks } from '../utils'
import { controlledRef, Tuple } from '../../src/domain'

let mocks: Tuple<jest.Mock, 3>

beforeEach(() => {
  mocks = makeMocks(3)
})

it('should hold a value', () => {
  const a = controlledRef(1)
  expect(a.value).toBe(1)
  a.value = 2
  expect(a.value).toBe(2)
})

describe('reactivity', () => {
  it('should be reactive', async () => {
    const a = controlledRef(1)

    watch(a, mocks[0], {
      deep: true
    })

    a.value = 2

    await nextTick()

    expect(mocks[0]).toBeCalledTimes(1)
    expect(mocks[0]).toHaveBeenCalledWith(2, 1, expect.any(Function))
  })

  it('should make nested properties reactive', async () => {
    const a = controlledRef({
      count: 1
    })

    watch(a, mocks[0], {
      deep: true
    })

    a.value.count = 2

    await nextTick()

    expect(mocks[0]).toBeCalledTimes(1)
  })

  it('should make arrays reactive', async () => {
    const a = controlledRef([])

    watch(a, mocks[0], {
      deep: true
    })

    a.value.push(1)

    await nextTick()

    expect(mocks[0]).toBeCalledTimes(1)
  })

  it('should unwrap ref', async () => {
    const a = ref(1)
    const b = controlledRef(a)

    watch(b, mocks[0], {
      deep: true
    })

    b.value = 2

    await nextTick()

    expect(mocks[0]).toBeCalledTimes(1)
    expect(mocks[0]).toHaveBeenCalledWith(2, 1, expect.any(Function))
  })

  it('should unwrap nested ref', async () => {
    const a = controlledRef({ count: ref(1) })

    watch(a, mocks[0], {
      deep: true
    })

    a.value.count = 2

    await nextTick()

    expect(mocks[0]).toBeCalledTimes(1)
    expect(mocks[0]).toHaveBeenCalledWith(
      { count: 2 },
      { count: 2 },
      expect.any(Function)
    )
  })

  it('ref in ref should update old refs', async () => {
    const a = ref(1)
    const b = controlledRef(a)
    const c = controlledRef(b)

    watch(a, mocks[0])
    watch(b, mocks[1])
    watch(c, mocks[2])

    c.value = 2

    await nextTick()

    expect(a.value).toBe(2)
    expect(b.value).toBe(2)
    expect(mocks[0]).toBeCalledTimes(1)
    expect(mocks[1]).toBeCalledTimes(1)
    expect(mocks[2]).toBeCalledTimes(1)

    c.silentSet(3)

    await nextTick()

    expect(a.value).toBe(3)
    expect(b.value).toBe(3)
    expect(mocks[0]).toBeCalledTimes(2)
    expect(mocks[1]).toBeCalledTimes(2)
    expect(mocks[2]).toBeCalledTimes(1)
  })
})

describe('silentSet', () => {
  it('should not trigger effects', async () => {
    const a = controlledRef(1)

    watch(a, mocks[0], {
      deep: true
    })

    a.silentSet(2)

    await nextTick()

    expect(mocks[0]).toBeCalledTimes(0)
  })
})
