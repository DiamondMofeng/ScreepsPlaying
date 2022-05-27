
/**
 * @class PriorityQueue     
 * 构造时传入一个数组，操作时等于对原数组进行操作，所以无需担心无法同步
 */
class PriortyQueue {
  constructor(queue) {
    this.queue = queue;
  }


  enqueue(item) {
    this.queue.push(item);
    this.queue.sort(function (b, a) {
      return a.priority - b.priority;
    });
  }

  // 使用上浮的方法插入
  enqueue2(item) {
    this.queue.push(item);
    let i = this.queue.length - 1;
    while (i > 0) {
      let parent = (i - 1) >> 1;
      if (this.queue[parent].priority < this.queue[i].priority) {
        let temp = this.queue[parent];
        this.queue[parent] = this.queue[i];
        this.queue[i] = temp;
      }
      else {
        break;
      }
    }
  }

  dequeue() {
    return this.queue.shift();
  }

  push(...args) {
    return this.enqueue2(...args);
  }

  pop() {
    return this.dequeue();
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