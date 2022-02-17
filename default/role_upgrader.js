const { getEnergyFromContainer,  getEnergyFromStorage } = require('./util_beheavor')



var roleUpgrader = {

  /** @param {Creep} creep **/
  run: function (creep) {

    if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.upgrading = false;
      creep.say('🔄 harvest');
    }
    if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
      creep.memory.upgrading = true;
      creep.say('⚡ upgrade');
    }

    if (creep.memory.upgrading) {
      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#FFFF00' } });
      }
    }
    else {//dont have energy
      //* 先从container里面拿，失败则去Storage里
      if (getEnergyFromContainer(creep) || getEnergyFromStorage(creep)) {

      }
      else {//dig
        // var sources = creep.room.find(FIND_SOURCES);

        // if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        //   creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
        // }
      }
    }
  }
}
module.exports = roleUpgrader.run;