import { ref } from 'vue';
import Form from '../../Form';
import {
  cleanupForm,
  getResultFormData,
  transformFormData
} from '../useValidation';

const testData = [
  [
    'without refs',
    () => new Form(),
    () => ({
      foo: {
        value: 1,
        rules: []
      },
      bar: {
        value: '2',
        rules: []
      },
      xs: [
        {
          foo: {
            value: {
              a: 1,
              b: 2,
              c: {
                d: 4
              }
            },
            rules: []
          },
          ys: [
            {
              foo: {
                value: 100,
                rules: []
              }
            },
            {
              foo: {
                value: 200,
                rules: []
              }
            }
          ]
        }
      ]
    })
  ] as const,
  [
    'with refs',
    () => new Form(),
    () => ({
      foo: {
        value: ref(1),
        rules: []
      },
      bar: {
        value: ref('2'),
        rules: []
      },
      xs: [
        {
          foo: {
            value: ref({
              a: 1,
              b: 2,
              c: {
                d: 4
              }
            }),
            rules: []
          },
          ys: [
            {
              foo: {
                value: ref(100),
                rules: []
              }
            },
            {
              foo: {
                value: ref(200),
                rules: []
              }
            }
          ]
        }
      ]
    })
  ] as const
];

describe('transformFormData', () => {
  it.each(testData)(
    'should add metadata to all form fields (%s)',
    (_, getForm, getFormData) => {
      const form = getForm();
      const formData = getFormData() as any;

      transformFormData(form, formData);

      // Top level foo
      expect(formData).toHaveProperty(['foo', 'uid']);
      expect(typeof formData.foo.uid).toBe('number');
      expect(formData).toHaveProperty(['foo', 'value'], 1);
      expect(formData).toHaveProperty(['foo', 'errors']);
      expect(Array.isArray(formData.foo.errors)).toBe(true);
      expect(formData).toHaveProperty(['foo', 'validating'], false);

      // Top level bar
      expect(formData).toHaveProperty(['bar', 'uid']);
      expect(typeof formData.bar.uid).toBe('number');
      expect(formData).toHaveProperty(['bar', 'value'], '2');
      expect(formData).toHaveProperty(['bar', 'errors']);
      expect(Array.isArray(formData.bar.errors)).toBe(true);
      expect(formData).toHaveProperty(['bar', 'validating'], false);

      // xs -> 0 -> foo
      expect(formData).toHaveProperty(['xs', '0', 'foo', 'uid']);
      expect(typeof formData.xs[0].foo.uid).toBe('number');
      expect(formData).toHaveProperty(['xs', '0', 'foo', 'value'], {
        a: 1,
        b: 2,
        c: {
          d: 4
        }
      });
      expect(formData).toHaveProperty(['xs', '0', 'foo', 'errors']);
      expect(Array.isArray(formData.xs[0].foo.errors)).toBe(true);
      expect(formData).toHaveProperty(['xs', '0', 'foo', 'validating'], false);

      // xs -> 0 -> ys -> 0 -> foo
      expect(formData).toHaveProperty(['xs', '0', 'ys', '0', 'foo', 'uid']);
      expect(typeof formData.xs[0].ys[0].foo.uid).toBe('number');
      expect(formData).toHaveProperty(
        ['xs', '0', 'ys', '0', 'foo', 'value'],
        100
      );
      expect(formData).toHaveProperty(['xs', '0', 'ys', '0', 'foo', 'errors']);
      expect(Array.isArray(formData.xs[0].ys[0].foo.errors)).toBe(true);
      expect(formData).toHaveProperty(
        ['xs', '0', 'ys', '0', 'foo', 'validating'],
        false
      );

      // xs -> 0 -> ys -> 1 -> foo
      expect(formData).toHaveProperty(['xs', '0', 'ys', '1', 'foo', 'uid']);
      expect(typeof formData.xs[0].ys[1].foo.uid).toBe('number');
      expect(formData).toHaveProperty(
        ['xs', '0', 'ys', '1', 'foo', 'value'],
        200
      );
      expect(formData).toHaveProperty(['xs', '0', 'ys', '1', 'foo', 'errors']);
      expect(Array.isArray(formData.xs[0].ys[0].foo.errors)).toBe(true);
      expect(formData).toHaveProperty(
        ['xs', '0', 'ys', '1', 'foo', 'validating'],
        false
      );
    }
  );
});

describe('cleanupForm', () => {
  it.each(testData)(
    'should call delete for every form field (%s)',
    (_, getForm, getFormData) => {
      const mockOnDelete = jest.fn();

      const form = getForm();
      const formData = getFormData();

      const mockForm = {
        onDelete: mockOnDelete
      } as any;

      transformFormData(form, formData);

      cleanupForm(mockForm, formData);

      expect(mockOnDelete).toHaveBeenCalledTimes(5);
    }
  );

  it.each(testData)(
    'should call delete for a subset of form fields (%s)',
    (_, getForm, getFormData) => {
      const mockOnDelete = jest.fn();

      const form = getForm();
      const formData = getFormData();

      const mockForm = {
        onDelete: mockOnDelete
      } as any;

      transformFormData(form, formData);

      const deleted = formData.xs.splice(0, 1);

      cleanupForm(mockForm, deleted);

      expect(mockOnDelete).toHaveBeenCalledTimes(3);
    }
  );
});

describe('getResultFormData', () => {
  it.each(testData)(
    'should discard everything except the value properties (%s)',
    (_, getForm, getFormData) => {
      const resultFormData = {};

      const form = getForm();
      const formData = getFormData();

      transformFormData(form, formData);
      getResultFormData(formData, resultFormData);

      expect(resultFormData).toEqual({
        foo: 1,
        bar: '2',
        xs: [
          {
            foo: {
              a: 1,
              b: 2,
              c: {
                d: 4
              }
            },
            ys: [{ foo: 100 }, { foo: 200 }]
          }
        ]
      });
    }
  );
});
