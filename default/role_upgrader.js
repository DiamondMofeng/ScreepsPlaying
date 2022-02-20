const { getEnergyFromContainer, getEnergyFromStorage, getEnergyFromNearbyLink } = require('./util_beheavor')



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
      //* 依次从Container,Link,Storage里拿
      if (getEnergyFromContainer(creep, { BL: ['61feb366182cf40dfd2b848a','61ff6d41e69b53cf867c9aac'] })
        || getEnergyFromNearbyLink(creep, { range: 2, minCap: 0 })
        || getEnergyFromStorage(creep)) {

      }
      else {

      }
    }
  }
}
module.exports = roleUpgrader.run;