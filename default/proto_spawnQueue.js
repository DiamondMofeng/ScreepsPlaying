
const C = require('util_consts')
const { bubbleDownDequeue, bubbleUpEnqueue } = require('./util_priorityQueue')

/**
 * 用于挂载spawnQueue相关原型方法
 */
const mountSpawnQueue = () => {






  Object.defineProperties(Room.prototype, {

    /* SPAWN QUEUE*/
    //注：这是一个大顶堆。
    spawnQueue: {
      get() {
        //? 没写是否检查这是自己的房间
        if (_.isUndefined(Memory.rooms)) {
          Memory.rooms = {}
        }

        if (_.isUndefined(Memory.rooms[this.name])) {
          Memory.rooms[this.name] = {}
        }

        if (_.isUndefined(Memory.rooms[this.name][C.RM.SPAWN_QUEUE])) {
          Memory.rooms[this.name][C.RM.SPAWN_QUEUE] = []
        }
        return Memory.rooms[this.name][C.RM.SPAWN_QUEUE]
      },
      set(value) { Memory.rooms[this.name][C.RM.SPAWN_QUEUE] = value },
      enumerable: false,
    },


    /**
     * 将Creep插入到arr末端,并通过其priority属性上浮排序至合适位置。
     * @param {CreepToSpawn} creepToSpawn 
     */
    pushToSpawnQueue: {
      value: function (creepToSpawn) {

        bubbleUpEnqueue(this.spawnQueue, creepToSpawn)

        return 0

      },
    },



    /**
     * 鉴于Room对象每tick都会重新构建，所以挂载Room对象下的属性不用担心跨tick污染
     */
    currentCreeps: {
      get() {

      }

    },




  })




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
              bubbleDownDequeue(this.room.spawnQueue)
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

module.exports = mountSpawnQueue