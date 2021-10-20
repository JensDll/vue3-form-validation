type ShouldInvokeResult = boolean | void
type DebounceOptions = {
  wait: number
  shouldInvoke?: (...args: any[]) => ShouldInvokeResult
}

export function debounce(
  target: (...args: any[]) => any,
  { wait, shouldInvoke }: DebounceOptions
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

  return debounced
}
