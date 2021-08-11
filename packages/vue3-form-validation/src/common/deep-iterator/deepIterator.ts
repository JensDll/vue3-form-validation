import { isRef } from 'vue'
import { LinkedList } from '../linked-list/LinkedList'

type Result = [
  key: string,
  value: any,
  parent: any,
  path: string[],
  isLeaf: boolean
]

export function* deepIterator(
  obj: object,
  predicate: (value: object) => boolean = () => false
): Generator<Result> {
  const stack = new LinkedList<
    [current: any, parent: any, parentKey: string, path: string[]]
  >()
  stack.addLast([obj, null, '', []])

  while (stack.count > 0) {
    const [current, parent, parentKey, path] = stack.last!.value
    stack.removeLast()

    let pushedItemsOnStack = false

    if (
      typeof current === 'object' &&
      current !== null &&
      !isRef(current) &&
      !predicate(current)
    ) {
      const entries = Object.entries(current)

      pushedItemsOnStack = entries.length > 0

      for (let i = entries.length - 1; i >= 0; i--) {
        const [key, value] = entries[i]
        stack.addLast([value, current, key, [...path, key]])
      }
    }

    if (typeof parent === 'object' && parent !== null) {
      yield [parentKey, parent[parentKey], parent, path, !pushedItemsOnStack]
    }
  }
}
