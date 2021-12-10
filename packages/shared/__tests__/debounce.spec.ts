import { debounce } from '../src/debounce'
import { makeMocks, makePromise } from '../src/jestHelper'
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
