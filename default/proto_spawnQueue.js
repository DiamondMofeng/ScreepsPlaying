/**
 * 用于挂载spawnQueue相关原型方法
 */
const proto_spawmQueue = () => {






  Object.defineProperties(Room.prototype, {

    /* SPAWN QUEUE*/
    //注：这是一个大顶堆。
    spawnQueue: {
      get() {
        //? 没写是否检查这是自己的房间

        if (_.isUndefined(Memory.rooms[this.name][C.RM.SPAWN_QUEUE])) {
          Memory.rooms[this.name][C.RM.SPAWN_QUEUE] = []
        }
        return Memory.rooms[this.name][C.RM.SPAWN_QUEUE]
      },
      set(value) { Memory.rooms[this.name][C.RM.SPAWN_QUEUE] = value },
      configurable: true,
      enumerable: true
    },


    /**
     * 将Creep插入到arr末端,并通过其priority属性上浮排序至合适位置。
     * @param {CreepToSpawn} creepToSpawn 
     */
    pushToSpawnQueue: {
      value: function (creepToSpawn) {
        let queue = this.spawnQueue
        queue.push(creepToSpawn)
        let i = queue.length - 1
        while (i > 0) {
          let parent = (i - 1) >> 1
          if (queue[parent].priority < queue[i].priority) {
            let temp = queue[parent]
            queue[parent] = queue[i]
            queue[i] = temp
          }
          else {
            break
          }
        }
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

        let creepToSpawn = getSpawnQueue(this.room)[0]
        if (creepToSpawn) {
          let memory = { ...creepToSpawn.memory, role: creepToSpawn.role }
          let opt = { ...creepToSpawn.opt, memory: memory }
          let spawnRes = this.spawnCreep(creepToSpawn.body, creepToSpawn.name, { ...opt, dryRun: false })
          if (spawnRes == OK) {
            getSpawnQueue(spawn.room).shift()
          }
          return spawnRes
        }

      }
    },

  })



}

module.exports = proto_spawmQueue