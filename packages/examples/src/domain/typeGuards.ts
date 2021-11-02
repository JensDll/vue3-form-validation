export const guards = {
  isDefined: <T>(x: T | null | undefined): x is T =>
    x !== null && typeof x !== 'undefined',
  isFormElement: (el: HTMLElement): el is HTMLFormElement =>
    el.tagName === 'FORM'
}
