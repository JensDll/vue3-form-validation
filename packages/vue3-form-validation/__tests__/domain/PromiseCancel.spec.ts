import { PromiseCancel } from '../../src/domain'
import { makePromise } from '../utils'

let promiseCancel: PromiseCancel<string>

beforeEach(() => {
  promiseCancel = new PromiseCancel()
})

it('should resolve normal when not cancelled', done => {
  const p1 = makePromise('p1', 400)
  const p2 = makePromise('p2', 800)

  promiseCancel
    .race(p1, p2)
    .then(a => {
      expect(a).toBe('p1')
      done()
    })
    .catch(() => {
      fail('Should not be reached!')
    })
})

it('should resolve directly after cancelResolve', done => {
  const p1 = makePromise('p1', 400)
  const p2 = makePromise('p2', 800)

  promiseCancel
    .race(p1, p2)
    .then(a => {
      expect(a).toBe('cancel')
      done()
    })
    .catch(() => {
      fail('Should not be reached!')
    })

  promiseCancel.cancelResolve('cancel')
})

it('should reject directly after cancelReject', done => {
  const p1 = makePromise('p1', 400)
  const p2 = makePromise('p2', 800)

  promiseCancel
    .race(p1, p2)
    .then(() => {
      fail('Should not be reached!')
    })
    .catch(a => {
      expect(a).toBe('cancel')
      done()
    })

  promiseCancel.cancelReject('cancel')
})
