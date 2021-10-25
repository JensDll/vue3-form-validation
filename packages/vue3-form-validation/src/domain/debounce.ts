type ShouldInvokeResult = boolean | void

export function debounce<TArgs extends unknown[]>(
  target: (...args: [...TArgs]) => void,
  {
    wait,
    shouldInvoke
  }: {
    wait: number
    shouldInvoke?: (...args: [...TArgs]) => ShouldInvokeResult
  }
): (...args: [...TArgs]) => void

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
  let shouldInvokeResult: ShouldInvokeResult = true

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
      timerId = setTimeout(effect(shouldInvokeResult), wait)
    } else {
      timerId = null
    }
  }

  return debounced as any
}
