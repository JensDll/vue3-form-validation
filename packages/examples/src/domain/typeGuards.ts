export const guards = {
  isDefined: <T>(x: T | null | undefined): x is T =>
    x !== null && typeof x !== 'undefined',
  // @ts-ignore save to ignore
  isFormElement: <T extends HTMLElement>(el: T): el is HTMLFormElement =>
    el.tagName === 'FORM'
}
