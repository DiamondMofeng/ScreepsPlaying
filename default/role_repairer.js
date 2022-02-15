// const Builder = require('./role_builder')

const { getEnergyFromContainer, recycleSelf, targetsPriorizer_byRef } = require('./util_beheavor')


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
            (
              s.structureType == STRUCTURE_TOWER)
            && ((s.hits / s.hitsMax) < 1)
          )
            || (
              (s.structureType == STRUCTURE_RAMPART)
              && ((s.hits / s.hitsMax) < 0.28)
            )
            || (
              (s.structureType == STRUCTURE_WALL)
              && ((s.hits / s.hitsMax) < 0.01)
            )
            || (
              (s.structureType == STRUCTURE_ROAD)
              && ((s.hits / s.hitsMax) < 0.5)
            )
            || (
              (s.structureType == STRUCTURE_CONTAINER)
              && ((s.hits / s.hitsMax) < 0.4)
            )
          // || (
          //   (s.structureType == STRUCTURE_RAMPART)
          //   && ((s.hits / s.hitsMax) < 0.5))
        }
      });
      // console.log('repireList:' + targets)
      if (targets.length) {
        let priorizedTarget = targetsPriorizer_byRef('structureType'
          , [
            STRUCTURE_TOWER,
            STRUCTURE_CONTAINER,
            STRUCTURE_RAMPART,
            STRUCTURE_ROAD,
            STRUCTURE_WALL
          ]
          , false)(targets)

        if (creep.repair(priorizedTarget) == ERR_NOT_IN_RANGE) {
          creep.moveTo(priorizedTarget, { visualizePathStyle: { stroke: '#0000CD', opacity: 0.2 } });
        }
      }


      //else recycleSelf
      else {
        recycleSelf(creep)
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