import assert from "power-assert";

import { bubbleDownDequeue, bubbleUpEnqueue, heapDelete, isOrderedHeap, PriorityQueue } from "./util_priorityQueue";

describe("isOrderedHeap", () => {
  it("returns true for an empty heap", () => {
    const heap: number[] = [];
    assert(isOrderedHeap(heap, (a, b) => a - b));
  });

  it("returns true for a really heap", () => {
    assert(isOrderedHeap([100, 90, 80, 70, 60, 50, 40], (a, b) => a - b));
    assert(isOrderedHeap([100, 80, 90, 60, 70, 1, 2], (a, b) => a - b));
    assert(isOrderedHeap([100, 90, 80, 10, 20, 50, 40], (a, b) => a - b));
    assert(isOrderedHeap([100, 90, 80, 70, 60, 50, 40], (a, b) => a - b));
    assert.equal(false, isOrderedHeap([100, 90, 60, 70, 91, 50, 40], (a, b) => a - b));
  });

});


describe("bubbleUpEnqueue", () => {
  it("heap is always ordered after enqueue", () => {
    const LEN = 1000

    const data = new Array(LEN).fill(0).map(() => Math.floor(Math.random() * 100000));
    const heap: number[] = [];
    data.forEach(
      (item) => {
        bubbleUpEnqueue(heap, item, (a, b) => a - b)
        assert(isOrderedHeap(heap, (a, b) => a - b));
      }
    );
  });

});

describe("bubbleDownDequeue", () => {

  it("heap is always ordered after dequeue", () => {
    const LEN = 1000

    const data = new Array(LEN).fill(0).map(() => Math.floor(Math.random() * 100000));
    const heap: number[] = [];
    data.forEach(
      (item) => {
        bubbleUpEnqueue(heap, item, (a, b) => a - b)
      }
    );

    for (let i = 0; i < data.length; i++) {
      bubbleDownDequeue(heap, (a, b) => a - b);
      assert(isOrderedHeap(heap, (a, b) => a - b));
    }
  }
  );

});

describe("heapDelete", () => {
  it("heap is always ordered after random delete", () => {
    const LEN = 1000

    const data = Array.from({ length: LEN }, () => Math.floor(Math.random() * 100000));
    const heap: number[] = []
    data.forEach(
      (item) => {
        bubbleUpEnqueue(heap, item, (a, b) => a - b)
        assert(isOrderedHeap(heap, (a, b) => a - b));
      }
    )

    for (let i = 0; i < LEN; i++) {
      const index = Math.floor(Math.random() * heap.length);
      const item = heap[index];
      const removedItem = heapDelete(heap, index, (a, b) => a - b);
      assert.equal(item, removedItem);
      assert(isOrderedHeap(heap, (a, b) => a - b));
    }

  })

});

describe("PriorityQueue", () => {
  it("`(a, b) => a - b` makes it a max-heap", () => {
    const queue = new PriorityQueue<number>((a, b) => a - b, []);
    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);
    assert(queue.dequeue() === 3);
    assert(queue.dequeue() === 2);
    assert(queue.dequeue() === 1);
  });

  it("`(a, b) => b - a` makes it a min-heap", () => {
    const queue = new PriorityQueue<number>((a, b) => b - a, []);
    const data = [50, 30, 10, 40, 20, 45, 35, 15, 25];
    data.forEach(item => queue.enqueue(item));
    data.sort((a, b) => a - b);
    for (let i = 0; i < data.length; i++) {
      assert(queue.dequeue() === data[i]);
    }
  });

  it("enqueue() and dequeue()", () => {
    const queue = new PriorityQueue<number>((a, b) => a - b, []);
    const data = [50, 30, 10, 40, 20, 45, 35, 15, 25];
    data.forEach(item => queue.enqueue(item));
    data.sort((a, b) => b - a);
    for (let i = 0; i < data.length; i++) {
      assert(queue.dequeue() === data[i]);
    }
  });

  it("should support custom datastructure", () => {
    interface WeightedItem {
      weight: number;
      value: any;
    }

    const queue = new PriorityQueue<WeightedItem>(
      (a, b) => a.weight - b.weight,
      []
    );
    const data = [{ weight: 50, value: "A" }, { weight: 30, value: "B" }, { weight: 10, value: "C" }, { weight: 40, value: "D" }, { weight: 20, value: "E" }];
    data.forEach(item => queue.enqueue(item));
    data.sort((a, b) => b.weight - a.weight);
    for (let i = 0; i < data.length; i++) {
      assert(queue.dequeue() === data[i]);
    }
  });

  it("`sortOnInit` should make it sorted", () => {
    const queue = new PriorityQueue<number>((a, b) => a - b, [1, 2, 3], true);
    assert(queue.dequeue() === 3);
    assert(queue.dequeue() === 2);
    assert(queue.dequeue() === 1);
  });

  it("应该能够正常处理所有方法", () => {
    const queue = new PriorityQueue<number>((a, b) => a - b, []);

    // 测试 enqueue 方法
    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);
    assert(queue.queue.length === 3);

    // 测试 dequeue 方法
    assert(queue.dequeue() === 3);
    assert(queue.queue.length === 2);

    // 测试 isEmpty 方法
    assert(queue.isEmpty() === false);
    queue.dequeue();
    queue.dequeue();
    assert(queue.isEmpty() === true);

    // 测试 peek 方法
    assert(queue.peek() === undefined);
    queue.enqueue(1);
    assert(queue.peek() === 1);
  });

});




