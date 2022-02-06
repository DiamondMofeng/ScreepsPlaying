const getEnergyFromContainer = (creep) => {

  const findContainer = (creep) => {
    return creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return structure.structureType == STRUCTURE_CONTAINER && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 100;
      }
    })
  }

  if (findContainer(creep).length) {
    const container = findContainer(creep)[0]
    if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      creep.moveTo(container, { visualizePathStyle: { stroke: '#FFFF00' } });
    }
    return true
  }
  else { return false }

}

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
      if (getEnergyFromContainer(creep)) {

      }
      else {//dig
        var sources = creep.room.find(FIND_SOURCES);

        if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
        }
      }
    }
  }
}
module.exports = roleUpgrader.run;