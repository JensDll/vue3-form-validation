import { makeMocks, makePromise } from '@/jest-helper'
import { debounce } from '../src/debounce'
import { Tuple } from '../src/types'

let mocks: Tuple<jest.Mock, 2>

beforeEach(() => {
  mocks = makeMocks(2, { mockReturn: () => true })
})

it('should debounce the function call', async () => {
  const debounced = debounce(mocks[0], { wait: 50 })
  debounced()
  debounced()
  debounced()

  await makePromise(50)

  expect(mocks[0]).toBeCalledTimes(1)
})

it('should cancel the function call', async () => {
  const debounced = debounce(mocks[0], { wait: 50 })
  debounced()
  debounced()
  debounced()

  debounced.cancel()

  await makePromise(50)

  expect(mocks[0]).toBeCalledTimes(0)
})

it('should work in tight loop', async () => {
  const debounced = debounce(mocks[0], { wait: 10 })

  for (let i = 1; i <= 10; i++) {
    if (i % 2 === 0) {
      debounced()
      debounced(i)
      await makePromise(10)
    } else {
      debounced()
      debounced.cancel()
      debounced()
      debounced.cancel()
      debounced.cancel()
      debounced.cancel()
      debounced(i)
      await makePromise(10)
    }
  }

  expect(mocks[0]).toBeCalledTimes(10)
  for (let i = 1; i <= 10; i++) {
    expect(mocks[0]).nthCalledWith(i, i)
  }
})
