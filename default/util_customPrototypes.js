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



const customPrototypes = () => {


  // if (_.isUndefined(StructureLink.prototype.Rmemory)) {

    let BUILDING_LINKS   = 'BUILDING_LINKS'
    Object.defineProperty(StructureLink.prototype, 'Rmemory', {
      get() {
        if (_.isUndefined(Memory.rooms[this.room.name])) {
          Memory.rooms[this.room.name] = {}
        }
        if (_.isUndefined(Memory.rooms[this.room.name][BUILDING_LINKS])) {
          Memory.rooms[this.room.name][BUILDING_LINKS] = {}
        }
        if (_.isUndefined(Memory.rooms[this.room.name][BUILDING_LINKS][this.id])) {
          Memory.rooms[this.room.name][BUILDING_LINKS][this.id] = {}
        }
        return Memory.rooms[this.room.name][BUILDING_LINKS][this.id]
      },
      set(value) { Memory.rooms[this.room.name][BUILDING_LINKS][this.id] = value },
      configurable: true,
      enumerable: true
    })
  // }
  // {
  //   globals.Memory.rooms=> this.
  // }

  // Object.defineProperty(StructureLink.prototype, 'memory', {
  //   get: function() {
  //       if(_.isUndefined(globals.Memory.rooms) || globals.Memory.rooms === 'undefined') {
  //           globals.Memory.rooms = {};
  //       }
  //       if(!_.isObject(globals.Memory.rooms)) {
  //           return undefined;
  //       }
  //       return globals.Memory.rooms[this.name] = globals.Memory.rooms[this.name] || {};
  //   },

  //   set: function(value) {
  //       if(_.isUndefined(globals.Memory.rooms) || globals.Memory.rooms === 'undefined') {
  //           globals.Memory.rooms = {};
  //       }
  //       if(!_.isObject(globals.Memory.rooms)) {
  //           throw new Error('Could not set room memory');
  //       }
  //       globals.Memory.rooms[this.name] = value;
  //   }
  // });


  //? 原来flag自己有memory。。。。
  // Object.defineProperty(Flag, 'memory', {
  //   value: Memory.flags[this.name],
  //   writable: true
  // })



}




module.exports = customPrototypes