import { LinkedList } from '../../src/domain'

let linkedList: LinkedList<number>

beforeEach(() => {
  linkedList = new LinkedList()
})

const iterationValuesForwards = <T>(linkedList: LinkedList<T>) => [
  ...linkedList.valuesForwards()
]

const iterationValuesBackwards = <T>(linkedList: LinkedList<T>) => [
  ...linkedList.valuesBackwards()
]

describe('Adding nodes', () => {
  describe('Add first by value', () => {
    it('should prepend the passed value and return the newly created node', () => {
      const n1 = linkedList.addFirst(1)
      const n2 = linkedList.addFirst(2)
      const n3 = linkedList.addFirst(3)
      const n4 = linkedList.addFirst(4)

      expect(n1.value).toBe(1)
      expect(n2.value).toBe(2)
      expect(n3.value).toBe(3)
      expect(n4.value).toBe(4)

      expect(iterationValuesForwards(linkedList)).toStrictEqual([4, 3, 2, 1])
      expect(iterationValuesBackwards(linkedList)).toStrictEqual([1, 2, 3, 4])
    })
  })

  describe('Add last by value', () => {
    it('should append the passed value and return the newly created node', () => {
      const n1 = linkedList.addLast(1)
      const n2 = linkedList.addLast(2)
      const n3 = linkedList.addLast(3)
      const n4 = linkedList.addLast(4)

      expect(n1.value).toBe(1)
      expect(n2.value).toBe(2)
      expect(n3.value).toBe(3)
      expect(n4.value).toBe(4)

      expect(iterationValuesForwards(linkedList)).toStrictEqual([1, 2, 3, 4])
      expect(iterationValuesBackwards(linkedList)).toStrictEqual([4, 3, 2, 1])
    })
  })
})

describe('Removing nodes', () => {
  describe('Remove first', () => {
    it('should remove the first node', () => {
      linkedList.addLast(1)
      linkedList.addLast(2)
      linkedList.addLast(3)

      linkedList.removeFirst()
      expect(iterationValuesForwards(linkedList)).toStrictEqual([2, 3])
      expect(iterationValuesBackwards(linkedList)).toStrictEqual([3, 2])
      linkedList.removeFirst()
      expect(iterationValuesForwards(linkedList)).toStrictEqual([3])
      expect(iterationValuesBackwards(linkedList)).toStrictEqual([3])
      linkedList.removeFirst()
      expect(iterationValuesForwards(linkedList)).toStrictEqual([])
      expect(iterationValuesBackwards(linkedList)).toStrictEqual([])
    })

    it('should do nothing if there are no nodes to remove', () => {
      linkedList.addLast(1)

      linkedList.removeFirst()
      expect(iterationValuesForwards(linkedList)).toStrictEqual([])
      expect(iterationValuesBackwards(linkedList)).toStrictEqual([])
      linkedList.removeFirst()
      expect(iterationValuesForwards(linkedList)).toStrictEqual([])
      expect(iterationValuesBackwards(linkedList)).toStrictEqual([])
    })
  })

  describe('Remove last', () => {
    it('should remove the last node', () => {
      linkedList.addLast(1)
      linkedList.addLast(2)
      linkedList.addLast(3)

      linkedList.removeLast()
      expect(iterationValuesForwards(linkedList)).toStrictEqual([1, 2])
      expect(iterationValuesBackwards(linkedList)).toStrictEqual([2, 1])
      linkedList.removeLast()
      expect(iterationValuesForwards(linkedList)).toStrictEqual([1])
      expect(iterationValuesBackwards(linkedList)).toStrictEqual([1])
      linkedList.removeLast()
      expect(iterationValuesForwards(linkedList)).toStrictEqual([])
      expect(iterationValuesBackwards(linkedList)).toStrictEqual([])
    })

    it('should do nothing if there are no nodes to remove', () => {
      linkedList.addLast(1)

      linkedList.removeLast()
      expect(iterationValuesForwards(linkedList)).toStrictEqual([])
      expect(iterationValuesBackwards(linkedList)).toStrictEqual([])
      linkedList.removeLast()
      expect(iterationValuesForwards(linkedList)).toStrictEqual([])
      expect(iterationValuesBackwards(linkedList)).toStrictEqual([])
    })
  })

  describe('Remove by node', () => {
    it('should correctly remove the head', () => {
      const head = linkedList.addLast(1)
      linkedList.addLast(2)
      linkedList.addLast(3)

      linkedList.remove(head)
      expect(iterationValuesForwards(linkedList)).toStrictEqual([2, 3])
      expect(iterationValuesBackwards(linkedList)).toStrictEqual([3, 2])
    })

    it('should correctly remove the tail', () => {
      linkedList.addLast(1)
      linkedList.addLast(2)
      const tail = linkedList.addLast(3)

      linkedList.remove(tail)
      expect(iterationValuesForwards(linkedList)).toStrictEqual([1, 2])
      expect(iterationValuesBackwards(linkedList)).toStrictEqual([2, 1])
    })

    it('should correctly remove nodes in between', () => {
      const n1 = linkedList.addLast(1)
      const n2 = linkedList.addLast(2)
      const n3 = linkedList.addLast(3)
      const n4 = linkedList.addLast(4)
      const n5 = linkedList.addLast(5)

      linkedList.remove(n2)
      expect(iterationValuesForwards(linkedList)).toStrictEqual([1, 3, 4, 5])
      expect(iterationValuesBackwards(linkedList)).toStrictEqual([5, 4, 3, 1])
      linkedList.remove(n3)
      expect(iterationValuesForwards(linkedList)).toStrictEqual([1, 4, 5])
      expect(iterationValuesBackwards(linkedList)).toStrictEqual([5, 4, 1])
      linkedList.remove(n4)
      expect(iterationValuesForwards(linkedList)).toStrictEqual([1, 5])
      expect(iterationValuesBackwards(linkedList)).toStrictEqual([5, 1])
      linkedList.remove(n1)
      expect(iterationValuesForwards(linkedList)).toStrictEqual([5])
      expect(iterationValuesBackwards(linkedList)).toStrictEqual([5])
      linkedList.remove(n5)
      expect(iterationValuesForwards(linkedList)).toStrictEqual([])
      expect(iterationValuesBackwards(linkedList)).toStrictEqual([])
    })

    it('should do nothing if there are no nodes to remove', () => {
      const n1 = linkedList.addLast(1)

      linkedList.remove(n1)
      expect(iterationValuesForwards(linkedList)).toStrictEqual([])
      expect(iterationValuesBackwards(linkedList)).toStrictEqual([])
      linkedList.remove(n1)
      expect(iterationValuesForwards(linkedList)).toStrictEqual([])
      expect(iterationValuesBackwards(linkedList)).toStrictEqual([])
    })
  })
})

describe('Node count', () => {
  it('should always be accurate', () => {
    expect(linkedList.count).toBe(0)

    for (let i = 1; i <= 1000; i++) {
      linkedList.addLast(42)
      expect(linkedList.count).toBe(i)
    }
    for (let i = 1000; i >= 1; i--) {
      expect(linkedList.count).toBe(i)
      linkedList.removeFirst()
    }

    expect(linkedList.count).toBe(0)
  })
})

describe('First and last properties', () => {
  it('should always point to the first and last node', () => {
    expect(linkedList.first).toStrictEqual(null)
    expect(linkedList.last).toStrictEqual(null)
    const n1 = linkedList.addFirst(1) // <= 1 =>
    expect(linkedList.first).toStrictEqual(n1)
    expect(linkedList.last).toStrictEqual(n1)
    const n2 = linkedList.addFirst(2) // <= 2 <-> 1 =>
    expect(linkedList.first).toStrictEqual(n2)
    expect(linkedList.last).toStrictEqual(n1)
    const n3 = linkedList.addFirst(3) // <= 3 <-> 2 <-> 1 =>
    expect(linkedList.first).toStrictEqual(n3)
    expect(linkedList.last).toStrictEqual(n1)
    const n4 = linkedList.addLast(4) // <= 3 <-> 2 <-> 1 <-> 4 =>
    expect(linkedList.first).toStrictEqual(n3)
    expect(linkedList.last).toStrictEqual(n4)

    linkedList.removeFirst() // <= 2 <-> 1 <-> 4 =>
    expect(linkedList.first).toStrictEqual(n2)
    expect(linkedList.last).toStrictEqual(n4)
    linkedList.remove(n1) // <= 2 <-> 4 =>
    expect(linkedList.first).toStrictEqual(n2)
    expect(linkedList.last).toStrictEqual(n4)
    linkedList.removeLast() // <= 2 =>
    expect(linkedList.first).toStrictEqual(n2)
    expect(linkedList.last).toStrictEqual(n2)
    linkedList.remove(n2) // <= =>
    expect(linkedList.first).toStrictEqual(null)
    expect(linkedList.last).toStrictEqual(null)
  })
})
