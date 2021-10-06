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
