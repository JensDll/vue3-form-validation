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

it('should cancel the function call', async () => {
  const debounced = debounce(mocks[0], { wait: 50 })
  debounced()
  debounced()
  debounced()

  debounced.cancel()

  await makePromise(50)

  expect(mocks[0]).toBeCalledTimes(0)
})
