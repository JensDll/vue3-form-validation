import { FormField } from '../FormField';

let formField: FormField;

beforeEach(() => {
  formField = new FormField(
    'name',
    'modelValue',
    Array.from({ length: 10 }, () => async () => 'Error')
  );
});

describe('get errors', () => {
  it('should filter out null values', () => {
    formField.setError(0, 'a');
    formField.setError(1, 'b');
    formField.setError(2, 'c');
    formField.setError(3, 'd');

    const errors = formField.getErrors().value;

    expect(errors.length).toBe(4);

    errors.forEach(err => expect(typeof err).toBe('string'));
  });
});
