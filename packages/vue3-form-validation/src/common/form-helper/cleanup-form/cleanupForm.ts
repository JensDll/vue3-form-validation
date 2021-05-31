import { Form } from '../../../form/Form';
import { deepIterator } from '../../deep-iterator/deepIterator';
import { isTransformedField } from '../../type-guards/typeGuards';

export function cleanupForm(form: Form, deletedData: any) {
  if (isTransformedField(deletedData)) {
    form.onDelete(deletedData.$uid);
    return;
  }

  for (const [, value] of deepIterator(deletedData, isTransformedField)) {
    if (isTransformedField(value)) {
      form.onDelete(value.$uid);
    }
  }
}
