import { trySet } from '../trySet';

it("should call success when the key value pair doesn't exist", () => {
  const map = new Map<number, string>();
  const success = jest.fn(x => x);

  trySet(map)({
    success(value) {
      success(value);
    },
    failure() {
      fail("Failure shouldn't be called");
    }
  })(1, 'foo');

  expect(success.mock.calls.length).toBe(1);
  expect(success.mock.calls[0][0]).toBe('foo');
});

it('should call failure when the key value pair exists', () => {
  const map = new Map<number, string>([[1, 'foo']]);
  const failure = jest.fn(x => x);

  trySet(map)({
    success() {
      fail("Success shouldn't be called");
    },
    failure(value) {
      failure(value);
    }
  })(1, 'bar');

  expect(failure.mock.calls.length).toBe(1);
  expect(failure.mock.calls[0][0]).toBe('foo');
});
