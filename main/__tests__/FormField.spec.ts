import FormField from '../FormField';

let formField: FormField;

beforeEach(() => {
  formField = new FormField(
    Array.from({ length: 10 }, () => async () => 'Error'),
    ''
  );
});

describe('has error', () => {
  it('should be false at the beginning', () => {
    expect(formField.hasError()).toBe(false);
  });

  it('should be true after setting errors', () => {
    formField.setError(0, '');
    expect(formField.hasError()).toBe(true);
  });

  it('should be false after removing errors', () => {
    formField.setError(0, '');
    formField.setError(1, 'a');
    formField.setError(5, '');

    expect(formField.hasError()).toBe(true);

    formField.setError(0, null);
    formField.setError(1, null);

    expect(formField.hasError()).toBe(true);

    formField.setError(5, null);

    expect(formField.hasError()).toBe(false);
  });
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
