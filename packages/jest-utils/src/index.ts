import { Tuple } from '@/shared'

export const makePromise = <T = undefined>(
  timeout: number,
  message?: T,
  mode: 'resolve' | 'reject' = 'resolve'
) =>
  new Promise<T>((resolve, reject) => {
    setTimeout(() => {
      if (mode === 'resolve') {
        // @ts-ignore
        resolve(message)
      } else {
        reject(message)
      }
    }, timeout)
  })

type MakeMockOptions = {
  mockReturn?: (x: any, i: number) => any
  timeout?: number
  increasing?: number
  mode?: 'resolve' | 'reject'
}

export function makeMocks<N extends number>(
  amount: N,
  { mockReturn, timeout, increasing, mode }: MakeMockOptions | undefined = {}
): Tuple<jest.Mock, N> {
  mockReturn ??= () => undefined
  increasing ??= 0
  mode ??= 'resolve'

  const mapping = (_: never, i: number) =>
    timeout
      ? jest.fn(x =>
          // @ts-ignore TS should figure this out
          makePromise(timeout + i * increasing, mockReturn(x, i), mode)
        )
      : // @ts-ignore This as well
        jest.fn(x => mockReturn(x, i))

  return Array.from({ length: amount }, mapping) as any
}
