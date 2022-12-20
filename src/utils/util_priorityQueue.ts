export type CompareFn<T> = (a: T, b: T) => number

/**
 * @param {T[]} arr
 * @param {T} item
 * @param {CompareFn<T>} compareFn - (a,b) => a-b 为大顶
 */
export function bubbleUpEnqueue<T>(arr: T[], item: T, compareFn: CompareFn<T>) {
  arr.push(item)
  let i = arr.length - 1
  bubbleUp(arr, i, compareFn);
}

/**
 * @param {T[]} arr
 * @param {CompareFn<T>} compareFn - (a,b) => a-b 为大顶
 */
export function bubbleDownDequeue<T>(arr: T[], compareFn: CompareFn<T>) {
  if (!arr.length) {
    return;
  }

  return heapDelete(arr, 0, compareFn);
}

export function heapDelete<T>(arr: T[], idx: number, compareFn: (a: T, b: T) => number): T | undefined {
  // 将要删除的元素和堆的最后一个元素交换位置
  [arr[idx], arr[arr.length - 1]] = [arr[arr.length - 1], arr[idx]];
  // 删除最后一个元素，即删除原来要删除的元素
  const deletedItem = arr.pop();

  bubbleUp(arr, idx, compareFn);
  bubbleDown(arr, idx, compareFn);

  return deletedItem;
}

function bubbleDown<T>(arr: T[], idx: number, compareFn: (a: T, b: T) => number) {
  if (idx >= arr.length) {
    return;
  }
  // 计算当前元素的左右子节点的下标
  const leftChildIdx = 2 * idx + 1;
  const rightChildIdx = 2 * idx + 2;
  let maxIdx = idx;
  if (leftChildIdx < arr.length && compareFn(arr[leftChildIdx], arr[maxIdx]) > 0) {
    maxIdx = leftChildIdx;
  }
  if (rightChildIdx < arr.length && compareFn(arr[rightChildIdx], arr[maxIdx]) > 0) {
    maxIdx = rightChildIdx;
  }
  // 如果最大元素的下标发生了变化，则交换位置，并继续递归
  if (maxIdx !== idx) {
    [arr[idx], arr[maxIdx]] = [arr[maxIdx], arr[idx]];
    bubbleDown(arr, maxIdx, compareFn);
  }
}

function bubbleUp<T>(arr: T[], idx: number, compareFn: (a: T, b: T) => number) {
  if (idx == 0) {
    return;
  }
  // 计算当前元素的父节点下标
  const parentIdx = (idx - 1) >> 1;
  // 如果当前元素比父节点大，则交换位置，并继续递归
  if (compareFn(arr[idx], arr[parentIdx]) > 0) {
    [arr[idx], arr[parentIdx]] = [arr[parentIdx], arr[idx]];
    bubbleUp(arr, parentIdx, compareFn);
  }
}



/** 是否是 **大顶** 有序 二叉堆 */
export function isOrderedHeap<T>(arr: T[], compareFn: CompareFn<T>): boolean {
  //简单地递归检查父节点与子节点的关系即可

  function check(idx: number): boolean {
    if (idx >= arr.length) {
      return true;
    }
    let left = idx * 2 + 1;
    let right = idx * 2 + 2;
    if (left < arr.length && compareFn(arr[idx], arr[left]) < 0) {
      return false;
    }
    if (right < arr.length && compareFn(arr[idx], arr[right]) < 0) {
      return false;
    }
    return check(left) && check(right);
  }

  return check(0);
}

/**
 * @class PriorityQueue     
 * 构造时传入一个数组，操作时等于对原数组进行操作，所以无需担心无法同步
 */
export class PriorityQueue<T> {

  compareFn: CompareFn<T>;
  queue: T[];

  /**
   * @param {CompareFn<T>} compareFn - (a,b) => a-b 为大顶
   * @param {T[]} queue
   * @param {boolean} sortOnInit - 是否在构造时对queue进行排序
   */
  constructor(compareFn: CompareFn<T>, queue: T[], sortOnInit = false) {
    this.compareFn = compareFn;
    this.queue = queue;
    if (sortOnInit && !isOrderedHeap(queue, compareFn)) {
      this.queue.sort((a, b) => -compareFn(a, b));
    }
  }

  sortEnqueue(item: T) {
    this.queue.push(item);
    this.queue.sort((a, b) => -this.compareFn(a, b));
  }

  // 使用上浮的方法插入
  bubbleUpEnqueue(item: T) {
    return bubbleUpEnqueue(this.queue, item, this.compareFn);
  }

  bubbleDownDequeue() {
    return bubbleDownDequeue(this.queue, this.compareFn);
  }

  enqueue(item: T) {
    return this.bubbleUpEnqueue(item);
  }

  dequeue() {
    return this.bubbleDownDequeue();
  }

  /** enqueue() 的别名 */
  push(item: T) {
    return this.enqueue(item);
  }

  /** dequeue() 的别名 */
  pop() {
    return this.dequeue();
  }

  /** 默认情况下是最大值 */
  front() {
    return this.queue[0];
  }

  /** 默认情况下是最大值 */
  peek() {
    return this.front();
  }

  // /** 没用
  //  * @deprecated
  //  */
  // back() {
  //   return this.queue[this.queue.length - 1];
  // }

  isEmpty() {
    return this.queue.length === 0;
  }

  size() {
    return this.queue.length;
  }

  print() {
    console.log(this.queue);
  }

  /**
   * 检查是非符合优先值从大到小排列
   * @returns 
   */
  check() {
    return isOrderedHeap(this.queue, this.compareFn);
  }
}
