import { Form } from '~/form'
import { deepIterator, isTransformedField } from '~/common'

export function cleanupForm(form: Form, deletedData: any) {
  if (isTransformedField(deletedData)) {
    form.onDelete(deletedData.$uid)
    return
  }

  for (const [, value] of deepIterator(deletedData, isTransformedField)) {
    if (isTransformedField(value)) {
      form.onDelete(value.$uid)
    }
  }
}
