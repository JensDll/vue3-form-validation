import { debounce, Tuple } from '../../src/domain'
import { makeMocks, makePromise } from '../utils'

let mocks: Tuple<jest.Mock, 2>

beforeEach(() => {
  mocks = makeMocks(2, { returnCallback: () => true })
})

it('should debounce the function call', async () => {
  const debounced = debounce(mocks[0], { wait: 50 })
  debounced()
  debounced()
  debounced()

  await makePromise(50)

  expect(mocks[0]).toBeCalledTimes(1)
})

it('should debounce the function call and invoke shouldInvoke', async () => {
  const debounced = debounce(mocks[0], { wait: 50, shouldInvoke: mocks[1] })
  debounced()
  debounced()
  debounced()

  await makePromise(100)

  expect(mocks[0]).toBeCalledTimes(1)
  expect(mocks[1]).toBeCalledTimes(3)
})

it('should not call function when shouldInvoke is false', async () => {
  const debounced = debounce(mocks[0], {
    wait: 50,
    shouldInvoke: () => false
  })
  debounced()
  debounced()
  debounced()

  await makePromise(50)

  expect(mocks[0]).toBeCalledTimes(0)
})

it('should always call last function where shouldInvoke is true', async () => {
  let i = 0
  const debounced: (n: number) => void = debounce(mocks[0], {
    wait: 50,
    shouldInvoke: () => i !== 3
  })

  debounced(++i)
  debounced(++i)
  debounced(++i)
  debounced(++i)
  debounced(++i)

  await makePromise(50)

  expect(mocks[0]).toBeCalledTimes(2)
  expect(mocks[0]).nthCalledWith(1, 2)
  expect(mocks[0]).nthCalledWith(2, 5)
})

it('should work in tight loop', async () => {
  const debounced: (n: number) => void = debounce(mocks[0], {
    wait: 50,
    shouldInvoke: n => n % 2 === 0
  })

  for (let i = 0; i <= 10; ++i) {
    debounced(i)
  }

  await makePromise(50)

  expect(mocks[0]).toBeCalledTimes(6)
  expect(mocks[0]).nthCalledWith(1, 0)
  expect(mocks[0]).nthCalledWith(2, 2)
  expect(mocks[0]).nthCalledWith(3, 4)
  expect(mocks[0]).nthCalledWith(4, 6)
  expect(mocks[0]).nthCalledWith(5, 8)
  expect(mocks[0]).nthCalledWith(6, 10)
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
