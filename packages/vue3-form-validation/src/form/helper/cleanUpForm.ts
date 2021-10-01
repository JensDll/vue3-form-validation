import { Form } from '../entities'
import * as _ from '../../common'

export function cleanupForm(form: Form, deletedData: any) {
  if (_.isTransformedField(deletedData)) {
    form.onDelete(deletedData.$uid)
    return
  }

  for (const [, value] of _.deepIterator(deletedData, _.isTransformedField)) {
    if (_.isTransformedField(value)) {
      form.onDelete(value.$uid)
    }
  }
}
