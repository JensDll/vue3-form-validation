import { isRef } from 'vue'
import { LinkedList } from './LinkedList'
import { isObject } from './typeGuards'

export type DeepIteratorResult = {
  key: string
  value: any
  parent: any
  path: string[]
  isLeaf: boolean
}

export function* deepIterator(
  obj: object,
  predicate: (value: object) => boolean = () => false
): Generator<DeepIteratorResult, void> {
  const stack = new LinkedList<{
    current: any
    parent: any
    parentKey: string
    path: string[]
  }>()
  stack.addLast({ current: obj, parent: null, parentKey: '', path: [] })

  while (stack.count > 0) {
    const { current, parent, parentKey, path } = stack.last!.value
    stack.removeLast()

    let pushedItemsOnStack = false

    if (isObject(current) && !isRef(current) && !predicate(current)) {
      const entries = Object.entries(current)

      pushedItemsOnStack = entries.length > 0

      for (let i = entries.length - 1; i >= 0; i--) {
        const [key, value] = entries[i]
        stack.addLast({
          current: value,
          parent: current,
          parentKey: key,
          path: [...path, key]
        })
      }
    }

    if (isObject(parent)) {
      yield {
        key: parentKey,
        value: parent[parentKey],
        parent,
        path,
        isLeaf: !pushedItemsOnStack
      }
    }
  }
}
