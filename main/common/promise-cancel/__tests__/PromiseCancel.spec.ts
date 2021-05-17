import { PromiseCancel } from '../PromiseCancel';

let promiseCancel: PromiseCancel<string>;

const promiseFactory = (
  mode: 'resolve' | 'reject',
  message: string,
  timeout: number
) =>
  new Promise<string>((resolve, reject) => {
    setTimeout(() => {
      if (mode === 'resolve') {
        resolve(message);
      } else {
        reject(message);
      }
    }, timeout);
  });

beforeEach(() => {
  promiseCancel = new PromiseCancel();
});

it('should resolve normal when not cancelled', done => {
  const p1 = promiseFactory('resolve', 'p1', 400);
  const p2 = promiseFactory('resolve', 'p2', 800);

  promiseCancel
    .race(p1, p2)
    .then(a => {
      expect(a).toBe('p1');
      done();
    })
    .catch(() => {
      fail("Shouldn't be reached!");
    });
});

it('should resolve directly after cancelResolve', done => {
  const p1 = promiseFactory('resolve', 'p1', 400);
  const p2 = promiseFactory('resolve', 'p2', 800);

  promiseCancel
    .race(p1, p2)
    .then(a => {
      expect(a).toBe('cancel');
      done();
    })
    .catch(() => {
      fail("Shouldn't be reached!");
    });

  promiseCancel.cancelResolve('cancel');
});

it('should reject directly after cancelReject', done => {
  const p1 = promiseFactory('resolve', 'p1', 400);
  const p2 = promiseFactory('resolve', 'p2', 800);

  promiseCancel
    .race(p1, p2)
    .then(() => {
      fail("Shouldn't be reached!");
    })
    .catch(a => {
      expect(a).toBe('cancel');
      done();
    });

  promiseCancel.cancelReject('cancel');
});
