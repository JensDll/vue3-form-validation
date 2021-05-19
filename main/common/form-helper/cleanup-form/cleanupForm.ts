import { Form } from '../../../form/Form';
import { deepIterator } from '../../deep-iterator/deepIterator';
import { isTransformedField } from '../../type-guards/typeGuards';

export function cleanupForm(form: Form, deletedFields: any) {
  for (const [, value] of deepIterator(deletedFields, isTransformedField)) {
    if (isTransformedField(value)) {
      form.onDelete(value.$uid);
    }
  }
}
