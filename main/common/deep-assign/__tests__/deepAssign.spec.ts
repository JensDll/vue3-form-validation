import { deepAssign } from '../deepAssign';

function randomizeValues(obj: any) {
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null) {
      randomizeValues(value);
    } else {
      obj[key] = Math.random().toString();
    }
  }
}

describe('Objects', () => {
  describe.each([
    [{}, { a: 'a_s', b: 'b_s' }, { a: 'a_s', b: 'b_s' }],
    [{}, { a: 'a_s', b: { c: 'c_s' } }, { a: 'a_s', b: { c: 'c_s' } }],
    [
      {},
      { a: 'a_s', b: { c: 'c_s' }, d: { e: 'e_s' } },
      { a: 'a_s', b: { c: 'c_s' }, d: { e: 'e_s' } }
    ],
    [{ a: 'a', b: 'b' }, { a: 'a_s' }, { a: 'a_s', b: 'b' }],
    [
      { a: 'a', b: { c: 'c', d: 'd' } },
      { b: { c: 'c_s' } },
      { a: 'a', b: { c: 'c_s', d: 'd' } }
    ]
  ])('%#: deepAssign(%o,%o) ----> %o', (target, source, expectedResult) => {
    test('should assign source to target', () => {
      deepAssign(target, source);
      expect(target).toStrictEqual(expectedResult);
    });

    test('should not copy references', () => {
      deepAssign(target, source);
      randomizeValues(source);
      expect(target).toStrictEqual(expectedResult);
    });
  });
});

describe('Arrays', () => {
  describe.each([
    [[], [1, 2, 3], [1, 2, 3]],
    [[], [{ a: 1 }, { a: 2 }, { a: 3 }], [{ a: 1 }, { a: 2 }, { a: 3 }]],
    [
      [
        { a: 'a', b: 'b' },
        { a: 'a', b: 'b' }
      ],
      [{ a: 1 }, { a: 2 }, { a: 3 }],
      [{ a: 1, b: 'b' }, { a: 2, b: 'b' }, { a: 3 }]
    ]
  ])('%#: deepAssign(%o,%o) ----> %o', (target, source, expectedResult) => {
    test('should assign source to target', () => {
      deepAssign(target, source);
      expect(target).toStrictEqual(expectedResult);
    });

    test('should not copy references', () => {
      deepAssign(target, source);
      randomizeValues(source);
      expect(target).toStrictEqual(expectedResult);
    });
  });
});

describe('Objects and Arrays', () => {
  describe.each([
    [{}, { a: 'a_s', bs: [1, 2, 3] }, { a: 'a_s', bs: [1, 2, 3] }],
    [
      { a: 'a', bs: [10, 10, 10, 10], c: 'c' },
      { a: 'a_s', bs: [1, 2, 3] },
      { a: 'a_s', bs: [1, 2, 3, 10], c: 'c' }
    ],
    [
      {
        a: 'a',
        bs: [
          { a: 'a', bs: [10, 10, 10], c: 'c' },
          { a: 'a', bs: [10, 10, 10], c: 'c' },
          { a: 'a', bs: [10, 10, 10], c: 'c' }
        ],
        c: 'c'
      },
      {
        a: 'a_s',
        bs: [
          { a: 'a_s', bs: [1, 2, 3], c: 'c_s' },
          { a: 'a_s', bs: [10, 11, 12], c: 'c_s' }
        ]
      },
      {
        a: 'a_s',
        bs: [
          { a: 'a_s', bs: [1, 2, 3], c: 'c_s' },
          { a: 'a_s', bs: [10, 11, 12], c: 'c_s' },
          { a: 'a', bs: [10, 10, 10], c: 'c' }
        ],
        c: 'c'
      }
    ]
  ])('%#: deepAssign(%o,%o) ----> %o', (target, source, expectedResult) => {
    test('should assign source to target', () => {
      deepAssign(target, source);
      expect(target).toStrictEqual(expectedResult);
    });

    test('should not copy references', () => {
      deepAssign(target, source);
      randomizeValues(source);
      expect(target).toStrictEqual(expectedResult);
    });
  });
});
