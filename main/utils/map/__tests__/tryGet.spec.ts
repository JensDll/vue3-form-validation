import { tryGet } from '../tryGet';

it('should call success when the key value pair exists', () => {
  const map = new Map([[1, 'foo']]);
  const success = jest.fn(x => x);

  tryGet(map)({
    success(value) {
      success(value);
    },
    failure() {
      fail("Failure shouldn't be called");
    }
  })(1);

  expect(success.mock.calls.length).toBe(1);
  expect(success.mock.calls[0][0]).toBe('foo');
});

it("should call failure when the key value pair doesn't exist", () => {
  const map = new Map([[1, 'foo']]);
  const failure = jest.fn();

  tryGet(map)({
    success() {
      fail("Success shouldn't be called");
    },
    failure() {
      failure();
    }
  })(2);

  expect(failure.mock.calls.length).toBe(1);
});
