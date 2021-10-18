import { debounce, Tuple } from '../../src/domain'
import { mockFactory } from '../utils'

let mocks: Tuple<jest.Mock, 2>

beforeEach(() => {
  mocks = mockFactory(2, () => '')
})

it('should debounce the function call and invoke side effect', done => {
  const debounced = debounce(mocks[0], { wait: 100, sideEffect: mocks[1] })
  debounced()
  debounced()
  debounced()

  setTimeout(() => {
    expect(mocks[0]).toHaveBeenCalledTimes(1)
    expect(mocks[1]).toHaveBeenCalledTimes(3)
    done()
  }, 100)
})
