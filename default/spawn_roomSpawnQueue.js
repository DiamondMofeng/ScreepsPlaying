



class SpawnQueue {
  constructor(roomName, priorityMap) {
    this._roomName = roomName
    this._queue = Memory.rooms[this.roomName].spawnQueue
    this._priorityMap = undefined
    if (priorityMap && priorityMap instanceof Map) {
      this._priorityMap = priorityMap
    } else {
      this._priorityMap = new Map()
      this._priorityMap.set('harvester', 100)
      this._priorityMap.set('carrier', 90)
      this._priorityMap.set('builder', 80)
      this._priorityMap.set('repairer', 75)
      this._priorityMap.set('miner', 20)
      this._priorityMap.set('upgrader', 10)
    }
  }

  /**
   * 按排列顺序进队
   * @param {Array} body 
   * @param {String} name 
   * @param {Object} memory
   * @param {Object} opt
   */
  push(body, name, memory, opt) {
    let creep = {
      body: body,
      name: name,
      memory: memory,
      opt: opt,
    }
    this._queue.push(creep)

  }

  /**
   * 出队优先级最高的元素
   */
  pop() {
    return this._queue.shift()
  }
}






/**
 * 传入
 */
Object.prototype.defineProperty(Room, 'spawnQueue',
  {
    get() {
      if (!this.memory.spawnQueue) {
        this.memory.spawnQueue = [];
      }
      return this.memory.spawnQueue;
    },
    set() { },

  }
)