import { Tuple } from '../src/domain'

export const makePromise = <T>(
  timeout: number,
  message?: T,
  mode: 'resolve' | 'reject' = 'resolve'
) =>
  new Promise<T>((resolve, reject) => {
    setTimeout(() => {
      if (mode === 'resolve') {
        resolve(message)
      } else {
        reject(message)
      }
    }, timeout)
  })

type MakeMockOptions = {
  returnCallback?: (x: any, i: number) => any
  timeout?: number
  increasing?: number
  mode?: 'resolve' | 'reject'
}

export function makeMocks<Amount extends number>(
  amount: Amount,
  {
    returnCallback,
    timeout,
    increasing,
    mode
  }: MakeMockOptions | undefined = {}
): Tuple<jest.Mock, Amount> {
  returnCallback ??= () => void 0
  increasing ??= 0
  mode ??= 'resolve'

  const mapping = (_: never, i: number) =>
    timeout
      ? jest.fn(x =>
          makePromise(timeout + i * increasing, returnCallback(x, i), mode)
        )
      : jest.fn(x => returnCallback(x, i))

  return Array.from({ length: amount }, mapping) as any
}
