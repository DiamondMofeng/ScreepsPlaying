export type CompareFn<T> = (a: T, b: T) => number
/**
 * @param {T[]} arr
 * @param {T} item
 * @param {CompareFn<T>} compareFn - 默认顺序为从大到小,你可以反转两个参数的顺序来实现从小到大
 */
export function bubbleUpEnqueue<T>(arr: T[], item: T, compareFn: CompareFn<T>) {
  arr.push(item)
  let i = arr.length - 1
  while (i > 0) {
    let parent = (i - 1) >> 1
    if (compareFn(arr[parent], arr[i]) < 0) {
      [arr[parent], arr[i]] = [arr[i], arr[parent]] //swap
      i = parent
    }
    else {
      break
    }
  }
}

export function bubbleDownDequeue<T>(arr: T[], compareFn: CompareFn<T>) {
  if (!arr.length) {
    return;
  }
  let item = arr[0]
  let last = arr.pop()!  //TODO add test
  if (arr.length > 0) {
    arr[0] = last
    let i = 0
    while (true) {
      let left = i * 2 + 1;
      let right = i * 2 + 2;
      // 找到left,right,i中的最大值位置
      let largest = i;
      if (left < arr.length && compareFn(arr[left], arr[largest]) > 0) {
        largest = left
      }
      if (right < arr.length && compareFn(arr[right], arr[largest]) > 0) {
        largest = right
      }

      if (largest != i) {
        // swap
        [arr[i], arr[largest]] = [arr[largest], arr[i]]
        i = largest
      } else {
        break;
      }

    }
  }
  return item
}


function isSorted<T>(arr: T[], compareFn: CompareFn<T>): boolean {
  for (let i = 1; i < arr.length; i++) {
    if (compareFn(arr[i - 1], arr[i]) < 0) {
      return false
    }
  }
  return true;
}

/**
 * @class PriorityQueue     
 * 构造时传入一个数组，操作时等于对原数组进行操作，所以无需担心无法同步
 */
class PriortyQueue<T> {

  compareFn: CompareFn<T>;
  queue: T[];

  constructor(compareFn: CompareFn<T>, queue: T[], sortOnInit = false) {
    this.compareFn = compareFn;
    this.queue = queue;
    if (sortOnInit && !isSorted(queue, compareFn)) {
      this.queue.sort(compareFn);
    }
  }


  sortEnqueue(item: T) {
    this.queue.push(item);
    this.queue.sort(this.compareFn);
  }

  // 使用上浮的方法插入
  bubbleUpEnqueue(item: T) {
    return bubbleUpEnqueue(this.queue, item, this.compareFn);
  }

  bubbleDownDequeue() {
    return bubbleDownDequeue(this.queue, this.compareFn);
  }

  push(...items: T[]) {
    items.forEach(item => {
      this.bubbleUpEnqueue(item);
    });
  }

  pop() {
    return this.bubbleDownDequeue();
  }

  front() {
    return this.queue[0];
  }

  back() {
    return this.queue[this.queue.length - 1];
  }

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
    return isSorted(this.queue, this.compareFn);
  }
}

export default {
  PriortyQueue,
  bubbleUpEnqueue,
  bubbleDownDequeue
}