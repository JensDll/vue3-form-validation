import { reactive, customRef, Ref, UnwrapRef, isRef } from 'vue'

import { isObject } from './typeGuards'

export type ControlledRef<T> = {
  silentSet: (value: T) => void
} & Ref<T>

export function controlledRef<T>(initial: T): ControlledRef<UnwrapRef<T>> {
  let _value: T = isRef(initial)
    ? initial.value
    : isObject(initial)
    ? reactive(initial as any)
    : initial

  let _track: () => void
  let _trigger: () => void

  const ref = customRef((track, trigger) => {
    _track = track
    _trigger = trigger

    return {
      get() {
        _track()
        return _value
      },
      set(value: T) {
        set(value)
      }
    }
  })

  function set(value: T, shouldTrigger = true) {
    _value = value
    if (shouldTrigger) {
      _trigger()
    }
  }

  function silentSet(value: T) {
    set(value, false)
  }

  Object.defineProperty(ref, 'silentSet', {
    value: silentSet
  })

  return ref as any
}
