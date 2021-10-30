type ShouldInvokeResult = boolean | void

export type Debounced<TArgs extends unknown[]> = {
  (...args: [...TArgs]): void
  cancel(): void
}

export function debounce<TArgs extends unknown[]>(
  target: (...args: [...TArgs]) => void,
  {
    wait,
    shouldInvoke
  }: {
    wait: number
    shouldInvoke?: (...args: [...TArgs]) => ShouldInvokeResult
  }
): Debounced<TArgs>

export function debounce(
  target: (...args: any[]) => void,
  {
    wait,
    shouldInvoke
  }: {
    wait: number
    shouldInvoke?: (...args: any[]) => ShouldInvokeResult
  }
) {
  let timerId: NodeJS.Timeout | null = null
  let cancelTimerId: NodeJS.Timeout | null = null
  let shouldInvokeResult: ShouldInvokeResult = true

  function cancel() {
    clearTimeout(cancelTimerId as any)
    cancelTimerId = null
  }

  function debounced(this: any, ...args: any[]) {
    if (shouldInvoke) {
      shouldInvokeResult = shouldInvoke.apply(this, args)
    }

    const effect = (shouldInvoke: ShouldInvokeResult) => () => {
      timerId = null
      if (shouldInvoke === true) {
        target.apply(this, args)
      }
    }

    if (shouldInvokeResult === true) {
      clearTimeout(timerId as any)
      cancelTimerId = timerId = setTimeout(effect(shouldInvokeResult), wait)
    } else {
      timerId = null
    }
  }

  debounced.cancel = cancel

  return debounced
}
