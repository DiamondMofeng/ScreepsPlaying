const Builder = require('./role_builder')

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
      creep.moveTo(container, { visualizePathStyle: { stroke: '#ffaa00' } });
    }
    return true
  }
  else { return false }

}

var roleRepairer = {

  /** @param {Creep} creep **/
  run: function (creep) {

    // const PriorizedBuildTarget = (buildTargets) => {
    // 	//默认按放置顺序建造
    // 	for (t in buildTargets) {
    // 		// switch (t) {
    // 		// 	case :
    // 		// 		break
    // 		// 	default:
    // 		// 		break
    // 		// }
    // 	}
    // }

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
            (s.structureType == STRUCTURE_CONTAINER ||
              s.structureType == STRUCTURE_ROAD)
            && ((s.hits / s.hitsMax) < 0.9))
        }
      });
      console.log('repireList:' + targets)
      if (targets.length) {
        if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
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