import { deepAssign } from '../deepAssign';

it('object: should assign shallow values', () => {
  const target = {};
  const source = { a: 'a', b: 'b' };
  const copy = { a: 'a', b: 'b' };

  deepAssign(target, source);

  source.a = 'foo';
  source.b = 'foo';

  expect(target).toStrictEqual(copy);
});

it('array: should assign shallow values', () => {
  const target: number[] = [];
  const source = [1, 2, 3];
  const copy = [1, 2, 3];

  deepAssign(target, source);

  source[0] = 10;

  expect(target).toStrictEqual(copy);
});

describe('deep assign', () => {
  it('object: should not copying references', () => {
    const target = {};
    const source = { a: 'a', b: { c: 'c', d: 'd' }, e: { f: 'f' } as any };
    const copy = { a: 'a', b: { c: 'c', d: 'd' }, e: { f: 'f' } as any };

    deepAssign(target, source);

    source.a = 'foo';
    source.b.c = 'foo';
    source.b.d = 'foo';
    delete source.e;

    expect(target).toStrictEqual(copy);
  });

  it('array: should not copying references', () => {
    const target = {};
    const source = { a: 'a', b: [1, 2, 3] as any[] };
    const copy = { a: 'a', b: [1, 2, 3] as any[] };

    deepAssign(target, source);

    source.a = 'foo';
    source.b[0] = 'foo';

    expect(target).toStrictEqual(copy);
  });

  it('should not copy references when target and source share the same properties', () => {
    const target = { a: { b: 'b' } };
    const source = { a: { b: 'bb' } };
    const copy = { a: { b: 'bb' } };

    deepAssign(target, source);

    source.a.b = 'foo';

    expect(target).toStrictEqual(copy);
  });
});
