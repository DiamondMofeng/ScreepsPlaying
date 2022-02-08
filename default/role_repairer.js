const Builder = require('./role_builder')
const { getEnergyFromContainer, PriorizedTarget } = require('./util_beheavor')


var roleRepairer = {

  /** @param {Creep} creep **/
  run: function (creep) {


    if (creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.repairing = false;
      creep.say('🔄 Collect Energy');//	
    }
    if (!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
      creep.memory.repairing = true;
      creep.say('🚧 repair');
    }

    if (creep.memory.repairing) {
      // console.log('myStructures:', creep.room.find(FIND_MY_STRUCTURES))
      var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (s) => {
          return (
            (s.structureType == STRUCTURE_CONTAINER
              // || s.structureType == STRUCTURE_ROAD
              || s.structureType == STRUCTURE_RAMPART
              || s.structureType == STRUCTURE_TOWER)
            && ((s.hits / s.hitsMax) < 0.9))
        }
      });
      console.log('repireList:' + targets)
      if (targets.length) {
        if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#0000CD', opacity: 0.2 } });
        }
      }


      //else work as builder
      else {
        Builder(creep)
      }
    }
    else {
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
};

module.exports = roleRepairer.run;