import {
  isArray,
  isField,
  isDefined,
  isObject,
  isTransformedField
} from '../typeGuards';

describe('isDefined', () => {
  it('null -> false', () => {
    expect(isDefined(null)).toBe(false);
  });

  it('undefined -> false', () => {
    expect(isDefined(void 0)).toBe(false);
  });

  it('any -> true', () => {
    expect(isDefined(0)).toBe(true);
  });
});

describe('isObject', () => {
  it('array -> false', () => {
    expect(isObject([])).toBe(false);
  });

  it('null -> false', () => {
    expect(isObject(null)).toBe(false);
  });

  it('{} -> true', () => {
    expect(isObject({})).toBe(true);
  });
});

describe('isArray', () => {
  it('null -> false', () => {
    expect(isArray(null)).toBe(false);
  });

  it('{} -> false', () => {
    expect(isArray({})).toBe(false);
  });

  it('[] -> true', () => {
    expect(isArray([])).toBe(true);
  });
});

describe('isField', () => {
  it('field -> true', () => {
    expect(isField({ $value: '', $rules: [] })).toBe(true);
  });
});

describe('isTransformedField', () => {
  it('transformedField -> true', () => {
    expect(
      isTransformedField({
        $uid: 1,
        $value: '',
        $errors: [],
        $hasError: false,
        $validating: false,
        $onBlur: () => {
          //
        }
      })
    ).toBe(true);
  });
});
