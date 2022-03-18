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

  Object.defineProperty(StructureContainer.prototype, 'Rmemory', {
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
  })

  //? 原来flag自己有memory。。。。
  // Object.defineProperty(Flag, 'memory', {
  //   value: Memory.flags[this.name],
  //   writable: true
  // })



}




module.exports = customPrototypes