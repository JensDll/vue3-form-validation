import { Tuple } from '../src/domain'

export const promiseFactory = <T>(
  message: T,
  timeout: number,
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
  returnCallback?: (i: number) => any
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
  returnCallback ??= i => i
  increasing ??= 0
  mode ??= 'resolve'

  const mapping = (_: never, i: number) => {
    const ret = returnCallback(i)

    return timeout
      ? jest.fn(() => promiseFactory(ret, timeout + i * increasing, mode))
      : jest.fn(() => ret)
  }

  return Array.from({ length: amount }, mapping) as any
}
