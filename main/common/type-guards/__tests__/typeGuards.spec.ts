import {
  isArray,
  isField,
  isNotNull,
  isObject,
  isTransformedField
} from '../typeGuards';

describe('isNotNull', () => {
  it('null -> false', () => {
    expect(isNotNull(null)).toBe(false);
  });

  it('any -> true', () => {
    expect(isNotNull(0)).toBe(true);
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
