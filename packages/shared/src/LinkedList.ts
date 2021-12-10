export class LinkedListNode<T> {
  value: T
  next: LinkedListNode<T> | null = null
  prev: LinkedListNode<T> | null = null

  constructor(value: T) {
    this.value = value
  }
}

export class LinkedList<T> {
  first: LinkedListNode<T> | null = null
  last: LinkedListNode<T> | null = null

  count = 0

  addFirst(value: T) {
    const node = new LinkedListNode(value)

    if (this.count === 0) {
      this.first = node
      this.last = node
    } else {
      node.next = this.first
      this.first!.prev = node
      this.first = node
    }

    this.count++

    return node
  }

  addLast(value: T) {
    const node = new LinkedListNode(value)

    if (this.count === 0) {
      this.first = node
      this.last = node
    } else {
      node.prev = this.last
      this.last!.next = node
      this.last = node
    }

    this.count++

    return node
  }

  remove(node: LinkedListNode<T>) {
    if (this.count === 0) {
      return
    }

    if (node === this.first) {
      this.removeFirst()
    } else if (node === this.last) {
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
      this.first = null
      this.last = null
      this.count--
    } else {
      this.first = this.first!.next
      this.first!.prev!.next = null
      this.first!.prev = null
      this.count--
    }
  }

  removeLast() {
    if (this.count === 0) {
      return
    }

    if (this.count === 1) {
      this.first = null
      this.last = null
      this.count--
    } else {
      this.last = this.last!.prev
      this.last!.next!.prev = null
      this.last!.next = null
      this.count--
    }
  }

  *nodesForwards() {
    let node = this.first

    for (; node !== null; node = node.next) {
      yield node
    }
  }

  *nodesBackwards() {
    let node = this.last

    for (; node !== null; node = node.prev) {
      yield node
    }
  }
}
