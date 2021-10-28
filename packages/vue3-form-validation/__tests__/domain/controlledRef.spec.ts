import { ref, watch, nextTick } from 'vue'

import { makeMocks } from '../utils'
import { controlledRef, Tuple } from '../../src/domain'

let mocks: Tuple<jest.Mock, 2>

beforeEach(() => {
  mocks = makeMocks(2)
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
    const a = controlledRef(ref(1))

    watch(a, mocks[0], {
      deep: true
    })

    a.value = 2

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
