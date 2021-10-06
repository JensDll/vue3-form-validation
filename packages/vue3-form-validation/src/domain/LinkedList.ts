export class LinkedListNode<T> {
  value: T
  next: LinkedListNode<T> | null = null
  prev: LinkedListNode<T> | null = null

  constructor(value: T) {
    this.value = value
  }
}

export class LinkedList<T> {
  private head: LinkedListNode<T> | null = null
  private tail: LinkedListNode<T> | null = null

  count = 0
  get first() {
    return this.head
  }
  get last() {
    return this.tail
  }

  addFirst(value: T) {
    const node = new LinkedListNode(value)

    if (this.count === 0) {
      this.head = node
      this.tail = node
    } else {
      node.next = this.head
      this.head!.prev = node
      this.head = node
    }

    this.count++

    return node
  }

  addLast(value: T) {
    const node = new LinkedListNode(value)

    if (this.count === 0) {
      this.head = node
      this.tail = node
    } else {
      node.prev = this.tail
      this.tail!.next = node
      this.tail = node
    }

    this.count++

    return node
  }

  remove(node: LinkedListNode<T>) {
    if (this.count === 0) {
      return
    }

    if (node === this.head) {
      this.removeFirst()
    } else if (node === this.tail) {
      this.removeLast()
    } else {
      node.prev!.next = node.next
      node.next!.prev = node.prev
      node.next = null
      node.prev = null
      this.count--
    }
  }

  removeFirst() {
    if (this.count === 0) {
      return
    }

    if (this.count === 1) {
      this.head = null
      this.tail = null
      this.count--
    } else {
      this.head = this.head!.next
      this.head!.prev!.next = null
      this.head!.prev = null
      this.count--
    }
  }

  removeLast() {
    if (this.count === 0) {
      return
    }

    if (this.count === 1) {
      this.head = null
      this.tail = null
      this.count--
    } else {
      this.tail = this.tail!.prev
      this.tail!.next!.prev = null
      this.tail!.next = null
      this.count--
    }
  }

  nodesForwards() {
    let node = this.head

    return {
      *[Symbol.iterator]() {
        for (; node !== null; node = node.next) {
          yield node
        }
      }
    }
  }

  nodesBackwards() {
    let node = this.tail

    return {
      *[Symbol.iterator]() {
        for (; node !== null; node = node.prev) {
          yield node
        }
      }
    }
  }
}
