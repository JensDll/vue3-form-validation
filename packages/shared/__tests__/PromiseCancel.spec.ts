import { makePromise } from '@/jest-helper'
import { PromiseCancel } from '../src/PromiseCancel'

let promiseCancel: PromiseCancel<string>

beforeEach(() => {
  promiseCancel = new PromiseCancel()
})

it('should resolve normal when not cancelled', done => {
  const p1 = makePromise(50, 'p1')
  const p2 = makePromise(100, 'p2')

  promiseCancel.race(p1, p2).then(a => {
    expect(a).toBe('p1')
    done()
  })
})

it('should resolve directly after cancelResolve', done => {
  const p1 = makePromise(50, 'p1')
  const p2 = makePromise(100, 'p2')

  promiseCancel.race(p1, p2).then(a => {
    expect(a).toBe('cancel')
    done()
  })

  promiseCancel.cancelResolve('cancel')
})

it('should reject directly after cancelReject', done => {
  const p1 = makePromise(50, 'p1')
  const p2 = makePromise(100, 'p2')

  promiseCancel
    .race(p1, p2)

    .catch(a => {
      expect(a).toBe('cancel')
      done()
    })

  promiseCancel.cancelReject('cancel')
})
