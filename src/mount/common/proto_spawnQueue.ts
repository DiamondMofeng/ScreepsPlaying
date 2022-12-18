
import { bubbleDownDequeue, bubbleUpEnqueue } from '@/utils/util_priorityQueue'

const priorityCompareFn = (a: CreepToSpawn, b: CreepToSpawn) => a.priority - b.priority

/**
 * 用于挂载spawnQueue相关原型方法
 */
const mountSpawnQueue = () => {

  Object.defineProperties(Room.prototype, {

    /* SPAWN QUEUE*/
    //注：这是一个大顶堆。
    spawnQueue: {
      get() {
        // 如果不是自己的房间，则返回
        if (!this.controller?.my) {
          return []
        }

        if (_.isUndefined(this.memory.spawnQueue)) {
          this.memory.spawnQueue = []
        }
        return this.memory.spawnQueue
      },
      set(value) { this.memory.spawnQueue = value },
      enumerable: false,
    },

    /**
     * 将Creep插入到arr末端,并通过其priority属性上浮排序至合适位置。
     * @param {CreepToSpawn} creepToSpawn 
     */
    pushToSpawnQueue: {
      value: function (creepToSpawn: CreepToSpawn) {

        bubbleUpEnqueue(this.spawnQueue, creepToSpawn, priorityCompareFn)

        return 0

      },
      writable: false,
    },

  } as PropertyDescriptorMap & ThisType<Room>)




  //* SPAWN
  Object.defineProperties(StructureSpawn.prototype, {


    /**
     * 尝试从spawn的room的spawnQueue生成一个creep
     */
    spawnFromQueue: {
      value: function () {

        let creepToSpawn = this.room.spawnQueue[0]
        if (creepToSpawn) {

          let name = creepToSpawn.name ||
            (creepToSpawn.role || creepToSpawn.memory.role) + Game.time
          let memory
          let opt


          memory = creepToSpawn.memory || {}
          if (creepToSpawn.role) {
            memory.role = creepToSpawn.role
          }

          memory = {
            ...memory,
            spawnName: this.name,
            spawnRoom: this.room.name,
          }

          opt = { ...creepToSpawn.opt, memory: memory }

          let spawnRes = this.spawnCreep(creepToSpawn.body, name, { ...opt, dryRun: false })
          // console.log('spawnRes: ', spawnRes, this);
          switch (spawnRes) {
            case OK:
            case ERR_INVALID_ARGS:
            case ERR_NAME_EXISTS:
              bubbleDownDequeue(this.room.spawnQueue, priorityCompareFn)
              break
            case ERR_NOT_ENOUGH_ENERGY:
              break
          }
          return spawnRes
        }

      }
    },

  })



}

export default mountSpawnQueue