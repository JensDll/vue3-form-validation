import Form from '../Form';

let form: Form;

beforeEach(() => {
  form = new Form();
});

describe('validate simple rules', () => {
  let rule1: jest.Mock;
  let rule2: jest.Mock;

  beforeEach(() => {
    rule1 = jest.fn(async x => x);
    rule2 = jest.fn(async x => x);
  });

  it("shouln't call rules when form field isn't touched", async () => {
    form.registerField(1, [rule1, rule2]);

    await form.validate(1);

    expect(rule1.mock.calls.length).toBe(0);
    expect(rule2.mock.calls.length).toBe(0);
  });

  it('should call all rules once with correct values', async () => {
    const field = form.registerField(1, [rule1, rule2]);
    field.touched = true;
    field.modelValue = 'foo';

    await form.validate(1);

    field.modelValue = 'bar';

    await form.validate(1);

    expect(rule1.mock.calls.length).toBe(2);
    expect(rule2.mock.calls.length).toBe(2);

    expect(rule1.mock.calls[0][0]).toBe('foo');
    expect(rule2.mock.calls[0][0]).toBe('foo');
    expect(rule1.mock.calls[1][0]).toBe('bar');
    expect(rule2.mock.calls[1][0]).toBe('bar');
  });

  describe('async validation', () => {
    let asyncRule1: jest.Mock;
    let asyncRule2: jest.Mock;

    beforeEach(() => {
      asyncRule1 = jest.fn(
        () =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve('Error 1');
            }, 1000);
          })
      );

      asyncRule2 = jest.fn(
        () =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve('Error 1');
            }, 2000);
          })
      );
    });

    it('validate should wait for rules to resolve', async () => {
      const field = form.registerField(1, [asyncRule1, asyncRule2]);
      field.touched = true;
      field.modelValue = 'foo';

      await form.validate(1);

      expect(asyncRule1.mock.calls.length).toBe(1);
      expect(asyncRule2.mock.calls.length).toBe(1);

      expect(asyncRule1.mock.calls[0][0]).toBe('foo');
      expect(asyncRule2.mock.calls[0][0]).toBe('foo');

      expect(field.getErrors().value).toStrictEqual(['Error 1', 'Error 1']);
    });
  });
});
