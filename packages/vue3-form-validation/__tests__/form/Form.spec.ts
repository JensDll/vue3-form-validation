import { Tuple } from '../../src/domain'
import { Form, FormField, ValidationBehaviorString } from '../../src/form'
import { mockFactory } from '../utils'

type EachValidationBehavior = {
  validationBehavior: ValidationBehaviorString
}

type ExpectedMap = Map<
  ValidationBehaviorString,
  {
    sync: Tuple<number, 8>
    async: Tuple<number, 8>
  }[]
>

type TestCase = {
  fieldUid: number
  touched: string
  expectedMap: ExpectedMap
}

describe.skip.each<EachValidationBehavior>([
  { validationBehavior: 'aggresive' },
  { validationBehavior: 'lazy' },
  { validationBehavior: 'lazier' }
])(
  `Testing validation with behavior "$validationBehavior"`,
  ({ validationBehavior }) => {
    const TEST_CASES: TestCase[] = [
      {
        fieldUid: 1,
        touched: 'ooo',
        expectedMap: new Map([
          [
            'aggresive',
            [
              {
                sync: [1, 1, 0, 0, 0, 0, 0, 0],
                async: [1, 1, 1, 0, 0, 1, 0, 1]
              },
              {
                sync: [2, 2, 0, 0, 0, 0, 0, 0],
                async: [2, 2, 2, 0, 0, 2, 0, 2]
              }
            ]
          ],
          [
            'lazy',
            [
              {
                sync: [0, 0, 0, 0, 0, 0, 0, 0],
                async: [0, 0, 0, 0, 0, 0, 0, 0]
              },
              {
                sync: [0, 0, 0, 0, 0, 0, 0, 0],
                async: [0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          ],
          [
            'lazier',
            [
              {
                sync: [0, 0, 0, 0, 0, 0, 0, 0],
                async: [0, 0, 0, 0, 0, 0, 0, 0]
              },
              {
                sync: [0, 0, 0, 0, 0, 0, 0, 0],
                async: [0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          ]
        ])
      },
      {
        fieldUid: 2,
        touched: 'ooo',
        expectedMap: new Map([
          [
            'aggresive',
            [
              {
                sync: [0, 0, 1, 1, 1, 1, 0, 0],
                async: [1, 0, 1, 1, 0, 1, 1, 0]
              },
              {
                sync: [0, 0, 2, 2, 2, 2, 0, 0],
                async: [2, 0, 2, 2, 0, 2, 2, 0]
              }
            ]
          ],
          [
            'lazy',
            [
              {
                sync: [0, 0, 0, 0, 0, 0, 0, 0],
                async: [0, 0, 0, 0, 0, 0, 0, 0]
              },
              {
                sync: [0, 0, 0, 0, 0, 0, 0, 0],
                async: [0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          ],
          [
            'lazier',
            [
              {
                sync: [0, 0, 0, 0, 0, 0, 0, 0],
                async: [0, 0, 0, 0, 0, 0, 0, 0]
              },
              {
                sync: [0, 0, 0, 0, 0, 0, 0, 0],
                async: [0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          ]
        ])
      },
      {
        fieldUid: 3,
        touched: 'ooo',
        expectedMap: new Map([
          [
            'aggresive',
            [
              {
                sync: [0, 0, 0, 0, 0, 0, 1, 1],
                async: [1, 1, 1, 1, 1, 1, 1, 1]
              },
              {
                sync: [0, 0, 0, 0, 0, 0, 2, 2],
                async: [2, 2, 2, 2, 2, 2, 2, 2]
              }
            ]
          ],
          [
            'lazy',
            [
              {
                sync: [0, 0, 0, 0, 0, 0, 0, 0],
                async: [0, 0, 0, 0, 0, 0, 0, 0]
              },
              {
                sync: [0, 0, 0, 0, 0, 0, 0, 0],
                async: [0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          ],
          [
            'lazier',
            [
              {
                sync: [0, 0, 0, 0, 0, 0, 0, 0],
                async: [0, 0, 0, 0, 0, 0, 0, 0]
              },
              {
                sync: [0, 0, 0, 0, 0, 0, 0, 0],
                async: [0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          ]
        ])
      },
      {
        fieldUid: 1,
        touched: 'too',
        expectedMap: new Map([
          [
            'aggresive',
            [
              {
                sync: [1, 1, 0, 0, 0, 0, 0, 0],
                async: [1, 1, 1, 0, 0, 1, 0, 1]
              },
              {
                sync: [2, 2, 0, 0, 0, 0, 0, 0],
                async: [2, 2, 2, 0, 0, 2, 0, 2]
              }
            ]
          ],
          [
            'lazy',
            [
              {
                sync: [1, 1, 0, 0, 0, 0, 0, 0],
                async: [0, 0, 0, 0, 0, 0, 0, 0]
              },
              {
                sync: [2, 2, 0, 0, 0, 0, 0, 0],
                async: [0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          ],
          [
            'lazier',
            [
              {
                sync: [0, 0, 0, 0, 0, 0, 0, 0],
                async: [0, 0, 0, 0, 0, 0, 0, 0]
              },
              {
                sync: [1, 0, 0, 0, 0, 0, 0, 0],
                async: [0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          ]
        ])
      },
      {
        fieldUid: 2,
        touched: 'oto',
        expectedMap: new Map([
          [
            'aggresive',
            [
              {
                sync: [0, 0, 1, 1, 1, 1, 0, 0],
                async: [1, 0, 1, 1, 0, 1, 1, 0]
              },
              {
                sync: [0, 0, 2, 2, 2, 2, 0, 0],
                async: [2, 0, 2, 2, 0, 2, 2, 0]
              }
            ]
          ],
          [
            'lazy',
            [
              {
                sync: [0, 0, 1, 1, 1, 1, 0, 0],
                async: [0, 0, 0, 0, 0, 0, 0, 0]
              },
              {
                sync: [0, 0, 2, 2, 2, 2, 0, 0],
                async: [0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          ],
          [
            'lazier',
            [
              {
                sync: [0, 0, 0, 0, 0, 0, 0, 0],
                async: [0, 0, 0, 0, 0, 0, 0, 0]
              },
              {
                sync: [0, 0, 0, 0, 0, 0, 0, 0],
                async: [0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          ]
        ])
      }
    ]

    describe.each<TestCase>(TEST_CASES)(
      `form.validate($fieldUid) ($touched) "${validationBehavior}"`,
      ({ fieldUid, touched, expectedMap }) => {
        /**
         * The form on which tests are performed
         */
        const form = new Form()
        /**
         * Example functions to be used in tests:
         * - Even rule numbers return strings others don't
         * - mock_s are synchronous
         * - mock_as are asynchronous
         */
        const mock_s = mockFactory(8, i => i % 2 === 0 && `s${i}`)
        const mock_as = mockFactory(8, i => i % 2 === 0 && `as${i}`, 10, 10)
        /**
         * The form setup used in this example
         */
        const fields: Tuple<FormField, 3> = [
          form.registerField(1, 'f1', '', validationBehavior, [
            mock_s[0],
            mock_s[1],
            { key: 'A', rule: mock_as[0] },
            { key: 'C', rule: mock_as[1] }
          ]),
          form.registerField(2, 'f2', '', validationBehavior, [
            mock_s[2],
            mock_s[3],
            mock_s[4],
            mock_s[5],
            { key: 'A', rule: mock_as[2] },
            { key: 'B', rule: mock_as[3] }
          ]),
          form.registerField(3, 'f3', '', validationBehavior, [
            mock_s[6],
            mock_s[7],
            mock_as[4],
            { key: 'A', rule: mock_as[5] },
            { key: 'B', rule: mock_as[6] },
            { key: 'C', rule: mock_as[7] }
          ])
        ]

        expect(touched.length).toBe(fields.length)

        for (let i = 0; i < touched.length; i++) {
          if (touched[i] === 't') {
            fields[i].touched = true
          }
        }

        const expected = expectedMap.get(validationBehavior)!

        for (let round = 0; round < expected.length; round++) {
          const { sync, async } = expected[round]
          for (let ruleNumber = 0; ruleNumber < sync.length; ruleNumber++) {
            if (touched !== 'too') continue
            test(`round #${round} - rule #${ruleNumber}`, async () => {
              if (ruleNumber === 0) {
                await form.validate(fieldUid)
              }
              expect(mock_s[ruleNumber]).toHaveBeenCalledTimes(sync[ruleNumber])
              expect(mock_as[ruleNumber]).toHaveBeenCalledTimes(
                async[ruleNumber]
              )
            })
          }
        }
      }
    )
  }
)
