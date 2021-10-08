import { Form } from './Form'
import * as n_domain from '../domain'

export function cleanupForm(form: Form, deletedFormData: any) {
  if (n_domain.isTransformedField(deletedFormData)) {
    form.onDelete(deletedFormData.$uid)
    return
  }

  for (const { value } of n_domain.deepIterator(
    deletedFormData,
    n_domain.isTransformedField
  )) {
    if (n_domain.isTransformedField(value)) {
      form.onDelete(value.$uid)
    }
  }
}
