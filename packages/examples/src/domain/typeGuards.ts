export const guards = {
  isDefined: <T>(x: T | null | undefined): x is T =>
    x !== null && typeof x !== 'undefined'
}
