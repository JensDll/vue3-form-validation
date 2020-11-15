import FormField from '../FormField';
import Form from '../Form';

let form: Form;

beforeEach(() => {
  form = new Form();
});

describe('validate simple rules', () => {
  let rule1: jest.Mock;
  let rule2: jest.Mock;

  beforeEach(() => {
    rule1 = jest.fn();
    rule2 = jest.fn();
  });

  it("shouln't call rules when form field isn't touched", async () => {
    form.registerField(1, [rule1, rule2]);

    await form.validate(1);

    expect(rule1).toHaveBeenCalledTimes(0);
    expect(rule2).toHaveBeenCalledTimes(0);
  });

  it('should call all rules once with correct values', async () => {
    const field = form.registerField(1, [rule1, rule2]);
    field.touched = true;
    field.modelValue = 'foo';

    await form.validate(1);

    field.modelValue = 'bar';

    await form.validate(1);

    expect(rule1).toHaveBeenCalledTimes(2);
    expect(rule2).toHaveBeenCalledTimes(2);

    expect(rule1).nthCalledWith(1, 'foo');
    expect(rule1).nthCalledWith(2, 'bar');

    expect(rule2).nthCalledWith(1, 'foo');
    expect(rule2).nthCalledWith(2, 'bar');
  });
});

describe('validate keyed rules', () => {
  let rule1: jest.Mock;
  let rule2: jest.Mock;
  let rule3: jest.Mock;
  let formField1: FormField;
  let formField2: FormField;

  beforeEach(() => {
    rule1 = jest.fn();
    rule2 = jest.fn();
    rule3 = jest.fn();

    const keyedRule1 = {
      key: 'a',
      rule: rule1
    };
    const keyedRule2 = {
      key: 'a',
      rule: rule2
    };
    const keyedRule3 = {
      key: 'b',
      rule: rule3
    };

    formField1 = form.registerField(1, [keyedRule1, keyedRule3]);
    formField2 = form.registerField(2, [keyedRule2]);
  });

  it("shouldn't call any rule when atleast one field is not touched", async () => {
    formField1.modelValue = 'ff1';
    formField1.touched = true;
    formField2.modelValue = 'ff2';

    await form.validate(1);

    expect(rule1).toHaveBeenCalledTimes(0);
    expect(rule2).toHaveBeenCalledTimes(0);
    expect(rule3).toHaveBeenCalledTimes(1);

    expect(rule3).nthCalledWith(1, 'ff1');

    await form.validate(2);

    expect(rule1).toHaveBeenCalledTimes(0);
    expect(rule2).toHaveBeenCalledTimes(0);
    expect(rule3).toHaveBeenCalledTimes(1);

    formField2.touched = true;

    await form.validate(1);

    expect(rule1).toHaveBeenCalledTimes(1);
    expect(rule2).toHaveBeenCalledTimes(1);
    expect(rule3).toHaveBeenCalledTimes(2);

    expect(rule1).nthCalledWith(1, 'ff1');
    expect(rule2).nthCalledWith(1, 'ff2');
    expect(rule3).nthCalledWith(2, 'ff1');

    await form.validate(2);

    expect(rule1).toHaveBeenCalledTimes(2);
    expect(rule2).toHaveBeenCalledTimes(2);
    expect(rule3).toHaveBeenCalledTimes(2);

    expect(rule1).nthCalledWith(2, 'ff1');
    expect(rule2).nthCalledWith(2, 'ff2');
  });
});

describe('complex examples', () => {
  let keyedRule1: jest.Mock;
  let keyedRule2: jest.Mock;
  let keyedRule3: jest.Mock;
  let keyedRule4: jest.Mock;
  let simpleRule1: jest.Mock;
  let simpleRule2: jest.Mock;
  let simpleRule3: jest.Mock;
  let formField1: FormField;
  let formField2: FormField;
  let formField3: FormField;

  beforeEach(() => {
    keyedRule1 = jest.fn(x => x);
    keyedRule2 = jest.fn(x => x);
    keyedRule3 = jest.fn(x => x);
    keyedRule4 = jest.fn(x => x);
    simpleRule1 = jest.fn(x => x);
    simpleRule2 = jest.fn(x => x);
    simpleRule3 = jest.fn(x => x);

    formField1 = form.registerField(1, [
      simpleRule1,
      { key: 'a', rule: keyedRule1 }
    ]);

    formField2 = form.registerField(2, [
      {
        key: 'a',
        rule: keyedRule2
      }
    ]);

    formField3 = form.registerField(3, [
      simpleRule2,
      simpleRule3,
      {
        key: 'a',
        rule: keyedRule3
      },
      {
        key: 'b',
        rule: keyedRule4
      }
    ]);
  });

  it('should always call simple rules but not always keyed rules', async () => {
    formField1.touched = true;

    await form.validate(1);

    expect(simpleRule1).toHaveBeenCalledTimes(1);
    expect(simpleRule2).toHaveBeenCalledTimes(0);
    expect(simpleRule3).toHaveBeenCalledTimes(0);
    expect(keyedRule1).toHaveBeenCalledTimes(0);
    expect(keyedRule2).toHaveBeenCalledTimes(0);
    expect(keyedRule3).toHaveBeenCalledTimes(0);
    expect(keyedRule4).toHaveBeenCalledTimes(0);

    formField3.touched = true;

    await form.validate(3);

    expect(simpleRule1).toHaveBeenCalledTimes(1);
    expect(simpleRule2).toHaveBeenCalledTimes(1);
    expect(simpleRule3).toHaveBeenCalledTimes(1);
    expect(keyedRule1).toHaveBeenCalledTimes(0);
    expect(keyedRule2).toHaveBeenCalledTimes(0);
    expect(keyedRule3).toHaveBeenCalledTimes(0);
    expect(keyedRule4).toHaveBeenCalledTimes(1);

    formField2.touched = true;

    await form.validate(3);

    expect(simpleRule1).toHaveBeenCalledTimes(1);
    expect(simpleRule2).toHaveBeenCalledTimes(2);
    expect(simpleRule3).toHaveBeenCalledTimes(2);
    expect(keyedRule1).toHaveBeenCalledTimes(1);
    expect(keyedRule2).toHaveBeenCalledTimes(1);
    expect(keyedRule3).toHaveBeenCalledTimes(1);
    expect(keyedRule4).toHaveBeenCalledTimes(2);

    await form.validate(2);

    expect(simpleRule1).toHaveBeenCalledTimes(1);
    expect(simpleRule2).toHaveBeenCalledTimes(2);
    expect(simpleRule3).toHaveBeenCalledTimes(2);
    expect(keyedRule1).toHaveBeenCalledTimes(2);
    expect(keyedRule2).toHaveBeenCalledTimes(2);
    expect(keyedRule3).toHaveBeenCalledTimes(2);
    expect(keyedRule4).toHaveBeenCalledTimes(2);

    await form.validate(1);

    expect(simpleRule1).toHaveBeenCalledTimes(2);
    expect(simpleRule2).toHaveBeenCalledTimes(2);
    expect(simpleRule3).toHaveBeenCalledTimes(2);
    expect(keyedRule1).toHaveBeenCalledTimes(3);
    expect(keyedRule2).toHaveBeenCalledTimes(3);
    expect(keyedRule3).toHaveBeenCalledTimes(3);
    expect(keyedRule4).toHaveBeenCalledTimes(2);
  });

  it('validate all should call all rules and set fields touched', async () => {
    expect(formField1.touched).toBe(false);
    expect(formField2.touched).toBe(false);
    expect(formField3.touched).toBe(false);

    let hasError = await form.validateAll();

    expect(formField1.touched).toBe(true);
    expect(formField2.touched).toBe(true);
    expect(formField3.touched).toBe(true);

    expect(hasError).toBe(false);

    expect(simpleRule1).toHaveBeenCalledTimes(1);
    expect(simpleRule2).toHaveBeenCalledTimes(1);
    expect(simpleRule3).toHaveBeenCalledTimes(1);
    expect(keyedRule1).toHaveBeenCalledTimes(1);
    expect(keyedRule2).toHaveBeenCalledTimes(1);
    expect(keyedRule3).toHaveBeenCalledTimes(1);
    expect(keyedRule4).toHaveBeenCalledTimes(1);

    formField1.modelValue = 'foo';

    hasError = await form.validateAll();

    expect(hasError).toBe(true);

    expect(simpleRule1).toHaveBeenCalledTimes(2);
    expect(simpleRule2).toHaveBeenCalledTimes(2);
    expect(simpleRule3).toHaveBeenCalledTimes(2);

    expect(keyedRule1).toHaveBeenCalledTimes(2);
    expect(keyedRule2).toHaveBeenCalledTimes(2);
    expect(keyedRule3).toHaveBeenCalledTimes(2);
    expect(keyedRule4).toHaveBeenCalledTimes(2);

    formField1.modelValue = null;

    hasError = await form.validateAll();

    expect(hasError).toBe(false);

    expect(simpleRule1).toHaveBeenCalledTimes(3);
    expect(simpleRule2).toHaveBeenCalledTimes(3);
    expect(simpleRule3).toHaveBeenCalledTimes(3);

    expect(keyedRule1).toHaveBeenCalledTimes(3);
    expect(keyedRule2).toHaveBeenCalledTimes(3);
    expect(keyedRule3).toHaveBeenCalledTimes(3);
    expect(keyedRule4).toHaveBeenCalledTimes(3);
  });
});

describe('async validation', () => {
  let simpleRule1: jest.Mock;
  let simpleRule2: jest.Mock;
  let simpleRule3: jest.Mock;
  let keyedRule1: jest.Mock;
  let keyedRule2: jest.Mock;
  let formField1: FormField;
  let formField2: FormField;
  let formField3: FormField;

  beforeEach(() => {
    simpleRule1 = jest.fn(
      () =>
        new Promise(resolve => {
          setTimeout(() => {
            resolve('S1');
          }, 500);
        })
    );

    simpleRule2 = jest.fn(
      () =>
        new Promise(resolve => {
          setTimeout(() => {
            resolve('S2');
          }, 1200);
        })
    );

    simpleRule3 = jest.fn(
      () =>
        new Promise(resolve => {
          setTimeout(() => {
            resolve('S3');
          }, 1000);
        })
    );

    keyedRule1 = jest.fn(
      () =>
        new Promise(resolve => {
          setTimeout(() => {
            resolve('K1');
          }, 400);
        })
    );

    keyedRule2 = jest.fn(
      () =>
        new Promise(resolve => {
          setTimeout(() => {
            resolve('K2');
          }, 800);
        })
    );

    formField1 = form.registerField(1, [simpleRule1, simpleRule2]);
    formField2 = form.registerField(2, [{ key: 'a', rule: keyedRule1 }]);
    formField3 = form.registerField(3, [
      simpleRule3,
      { key: 'a', rule: keyedRule2 }
    ]);
  });

  it('validate all should wait for all rules to resolve', async () => {
    formField1.modelValue = 'ff1';
    formField2.modelValue = 'ff2';
    formField3.modelValue = 'ff3';

    await form.validateAll();

    expect(simpleRule1).toHaveBeenCalledTimes(1);
    expect(simpleRule2).toHaveBeenCalledTimes(1);
    expect(simpleRule3).toHaveBeenCalledTimes(1);
    expect(keyedRule1).toHaveBeenCalledTimes(1);
    expect(keyedRule2).toHaveBeenCalledTimes(1);

    expect(simpleRule1).toHaveBeenCalledWith('ff1');
    expect(simpleRule2).toHaveBeenCalledWith('ff1');
    expect(simpleRule3).toHaveBeenCalledWith('ff3');
    expect(keyedRule1).toHaveBeenCalledWith('ff2');
    expect(keyedRule2).toHaveBeenCalledWith('ff3');

    expect(formField1.getErrors().value).toContain('S1');
    expect(formField1.getErrors().value).toContain('S2');

    expect(formField2.getErrors().value).toContain('K1');

    expect(formField3.getErrors().value).toContain('S3');
    expect(formField3.getErrors().value).toContain('K2');
  });
});
