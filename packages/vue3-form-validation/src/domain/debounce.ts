type DebounceOptions = {
  wait: number
}

export type Debounced<TArgs extends unknown[]> = {
  (...args: [...TArgs]): void
  cancel(): void
}

export function debounce<TArgs extends unknown[]>(
  target: (...args: [...TArgs]) => void,
  { wait }: DebounceOptions
): Debounced<TArgs>

export function debounce(
  target: (...args: any[]) => void,
  { wait }: DebounceOptions
) {
  let timerId: NodeJS.Timeout | null = null

  function cancel() {
    clearTimeout(timerId as any)
  }

  function debounced(this: any, ...args: any[]) {
    const effect = () => {
      timerId = null
      target.apply(this, args)
    }

    clearTimeout(timerId as any)
    timerId = setTimeout(effect, wait)
  }

  debounced.cancel = cancel

  return debounced
}
