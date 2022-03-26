/*
默认的memory:共5种
* Flag.memory
* Spawn.memory
* Creep.memory
* PowerCreep.memory
* Room.memory

! Rmemory 代指 记忆存储在所属本房间下
如：Link.Rmemory==Link.room.memory['BUINDING_LINK'][Link.id]
*/

const C = require("./util_consts")



const customPrototypes = () => {


  //* LINK
  Object.defineProperty(StructureLink.prototype, 'Rmemory', {
    get() {
      if (_.isUndefined(Memory.rooms[this.room.name])) {
        Memory.rooms[this.room.name] = {}
      }
      if (_.isUndefined(Memory.rooms[this.room.name][C.RM.LINKS])) {
        Memory.rooms[this.room.name][C.RM.LINKS] = {}
      }
      if (_.isUndefined(Memory.rooms[this.room.name][C.RM.LINKS][this.id])) {
        Memory.rooms[this.room.name][C.RM.LINKS][this.id] = {}
      }
      return Memory.rooms[this.room.name][C.RM.LINKS][this.id]
    },
    set(value) { Memory.rooms[this.room.name][C.RM.LINKS][this.id] = value },
    configurable: true,
    enumerable: true
  })





  //* CONTAINER
  Object.defineProperties(StructureContainer.prototype, {
    Rmemory: {
      get() {
        if (_.isUndefined(Memory.rooms[this.room.name])) {
          Memory.rooms[this.room.name] = {}
        }
        if (_.isUndefined(Memory.rooms[this.room.name][C.RM.CONTAINERS])) {
          Memory.rooms[this.room.name][C.RM.CONTAINERS] = {}
        }
        if (_.isUndefined(Memory.rooms[this.room.name][C.RM.CONTAINERS][this.id])) {
          Memory.rooms[this.room.name][C.RM.CONTAINERS][this.id] = {}
        }
        return Memory.rooms[this.room.name][C.RM.CONTAINERS][this.id]
      },
      set(value) { Memory.rooms[this.room.name][C.RM.CONTAINERS][this.id] = value },
      configurable: true,
      enumerable: true
    },
    type: {
      get() {
        if (!_.isUndefined(this.Rmemory && this.Rmemory.type)) {
          return this.Rmemory.type
        }
        else {
          let sources = this.room.find(FIND_SOURCES)
          for (s of sources) {
            if (this.pos.inRangeTo(s, 2) == true) {
              this.Rmemory.type = 'source'
            }
          }

          //storage
          let storage = this.room.storage
          if (storage && this.pos.inRangeTo(storage, 2) == true) {
            this.Rmemory.type = 'storage'
          }

          //contoller
          let controller = this.room.controller
          if (this.pos.inRangeTo(controller, 2) == true) {
            this.Rmemory.type = 'controller'
          }
          //mineral
          let mineral = this.room.find(FIND_MINERALS)[0]
          if (this.pos.inRangeTo(mineral, 2) == true) {
            this.Rmemory.type = 'mineral'
          }

          //unknow
          if (_.isUndefined(this.Rmemory.type)) {
            this.Rmemory.type = 'unknow'
          }
          // this.Rmemory.type
          return this.Rmemory.type
        }

      },
      set(value) { this.Rmemory.type = value },
      configurable: true,
      enumerable: true
    }
  })

  //? 原来flag自己有memory。。。。
  // Object.defineProperty(Flag, 'memory', {
  //   value: Memory.flags[this.name],
  //   writable: true
  // })


  //* ROOM
  Object.defineProperties(Room.prototype, {
    /**
     * 直接获取mineral对象
     */
    mineral: {
      get() {
        if (!this.memory._mineralID) {
          this.memory._mineralID = this.find(FIND_MINERALS)[0].id
        }
        return Game.getObjectById(this.memory._mineralID)
      },
      configurable: true,
      enumerable: true
    }
  })


}




module.exports = customPrototypes