export class ValidationError extends Error {
  constructor() {
    super('One or more validation errors occurred.')
  }
}
