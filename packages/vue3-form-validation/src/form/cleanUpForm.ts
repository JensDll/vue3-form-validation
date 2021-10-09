import { Form } from './Form'
import * as n_domain from '../domain'
import { DisposableMap } from './transformFormData'

export function cleanupForm(
  form: Form,
  deletedFormData: any,
  disposables: DisposableMap
) {
  const dispose = n_domain.tryGet(disposables)({
    success: fs => fs.forEach(f => f())
  })

  if (n_domain.isTransformedField(deletedFormData)) {
    dispose(deletedFormData.$uid)
    form.onDelete(deletedFormData.$uid)
    disposables.delete(deletedFormData.$uid)
    return
  }

  for (const { value } of n_domain.deepIterator(
    deletedFormData,
    n_domain.isTransformedField
  )) {
    if (n_domain.isTransformedField(value)) {
      dispose(value.$uid)
      form.onDelete(value.$uid)
      disposables.delete(value.$uid)
    }
  }
}
