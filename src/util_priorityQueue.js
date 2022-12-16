export function bubbleUpEnqueue(arr, item) {
  arr.push(item)
  let i = arr.length - 1
  while (i > 0) {
    let parent = (i - 1) >> 1
    console.log(i, parent, JSON.stringify(arr[parent]), JSON.stringify(arr[i]))
    if (arr[parent].priority < arr[i].priority) {
      [arr[parent], arr[i]] = [arr[i], arr[parent]] //swap
      i = parent
    }
    else {
      break
    }
  }
}

export function bubbleDownDequeue(arr) {
  let item = arr[0]
  let last = arr.pop()
  if (arr.length > 0) {
    arr[0] = last
    let i = 0
    while (true) {
      let left = i * 2 + 1;
      let right = i * 2 + 2;
      // 找到left,right,i中的最大值位置
      let largest = i;
      if (left < arr.length && arr[left].priority > arr[largest].priority) {
        largest = left
      }
      if (right < arr.length && arr[right].priority > arr[largest].priority) {
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


/**
 * @class PriorityQueue     
 * 构造时传入一个数组，操作时等于对原数组进行操作，所以无需担心无法同步
 */
class PriortyQueue {
  constructor(queue) {
    this.queue = queue;
  }


  sortEnqueue(item) {
    this.queue.push(item);
    this.queue.sort(function (b, a) {
      return a.priority - b.priority;
    });
  }

  // 使用上浮的方法插入
  bubbleUpEnqueue(item) {
    return bubbleUpEnqueue(this.queue, item);
  }

  bubbleDownDequeue() {
    return bubbleDownDequeue(this.queue);
  }

  push(...args) {
    return this.bubbleUpEnqueue(...args);
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
    return this.queue.length == 0;
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
    for (let i = 1; i < this.queue.length; i++) {
      if (this.queue[i].priority >= this.queue[i - 1].priority) {
        return false
      }
    }
    return true;
  }
}

export default {
  PriortyQueue,
  bubbleUpEnqueue,
  bubbleDownDequeue
}