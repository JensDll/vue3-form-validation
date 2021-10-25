import { debounce, Tuple } from '../../src/domain'
import { makeMocks } from '../utils'

let mocks: Tuple<jest.Mock, 2>

beforeEach(() => {
  mocks = makeMocks(2, () => true)
})

describe('without shouldInvoke', () => {
  it('should debounce the function call', done => {
    const debounced = debounce(mocks[0], { wait: 100 })
    debounced()
    debounced()
    debounced()

    setTimeout(() => {
      expect(mocks[0]).toHaveBeenCalledTimes(1)
      done()
    }, 100)
  })
})

describe('with shouldInvoke', () => {
  it('should debounce the function call and invoke shouldInvoke', done => {
    const debounced = debounce(mocks[0], { wait: 100, shouldInvoke: mocks[1] })
    debounced()
    debounced()
    debounced()

    setTimeout(() => {
      expect(mocks[0]).toHaveBeenCalledTimes(1)
      expect(mocks[1]).toHaveBeenCalledTimes(3)
      done()
    }, 100)
  })

  it('should not call function when shouldInvoke is false', done => {
    const debounced = debounce(mocks[0], {
      wait: 100,
      shouldInvoke: () => false
    })
    debounced()
    debounced()
    debounced()

    setTimeout(() => {
      expect(mocks[0]).toHaveBeenCalledTimes(0)
      done()
    }, 100)
  })

  it('should always call last function where shouldInvoke is true', done => {
    let i = 0
    const debounced: (n: number) => void = debounce(mocks[0], {
      wait: 100,
      shouldInvoke: () => i !== 3
    })

    debounced(++i)
    debounced(++i)
    debounced(++i)
    debounced(++i)
    debounced(++i)

    setTimeout(() => {
      expect(mocks[0]).toHaveBeenCalledTimes(2)
      expect(mocks[0]).toHaveBeenNthCalledWith(1, 2)
      expect(mocks[0]).toHaveBeenNthCalledWith(2, 5)
      done()
    }, 100)
  })

  it('should work in tight loop', done => {
    let i = 1
    let n = 1

    const debounced: (n: number) => void = debounce(mocks[0], {
      wait: 100,
      shouldInvoke: () => i >= 5
    })

    for (; n <= 20; ++n, ++i) {
      debounced(i)
    }

    setTimeout(() => {
      for (; n >= 1; --n, --i) {
        debounced(i)
      }

      setTimeout(() => {
        expect(mocks[0]).toHaveBeenCalledTimes(2)
        expect(mocks[0]).toHaveBeenNthCalledWith(1, 20)
        expect(mocks[0]).toHaveBeenNthCalledWith(2, 5)
        done()
      }, 100)
    }, 100)
  })
})
