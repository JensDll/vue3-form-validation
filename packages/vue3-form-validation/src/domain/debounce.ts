type DebounceOptions = {
  wait: number
  sideEffect?: () => void
}

export function debounce(
  target: (...args: any[]) => any,
  { wait, sideEffect }: DebounceOptions
) {
  let timerId: NodeJS.Timeout | null = null

  function debounced(this: any, ...args: any[]) {
    sideEffect?.()

    const effect = () => {
      timerId = null
      target.apply(this, args)
    }

    clearTimeout(timerId as any)

    timerId = setTimeout(effect, wait)
  }

  return debounced
}
