const { workingStatesKeeper, getEnergyFromStorage } = require("./util_beheavor");


let repairTargetId = "repairerTargetId"
/**
 * 
 * @param {Creep} creep 
 */
const roleWallRepairer = (creep) => {

  workingStatesKeeper(creep,
    () => {
      getEnergyFromStorage(creep)
    },
    () => {
      if (Game.time % 500 == 0) {
        delete creep.memory[repairTargetId]
      }

      if (!creep.memory[repairTargetId]) {
        let targets = creep.room.find(FIND_STRUCTURES, {
          filter: (structure) => {
            return (structure.structureType == STRUCTURE_WALL ||
              structure.structureType == STRUCTURE_RAMPART) && structure.hits < structure.hitsMax;
          }
        });
        if (targets.length > 0) {
          targets.sort((a, b) => a.hits - b.hits);
          creep.memory[repairTargetId] = targets[0].id;
        }
      }

      if (creep.memory[repairTargetId]) {
        let target = Game.getObjectById(creep.memory[repairTargetId]);
        if (creep.repair(target) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
        }
      }

    }
  )



}


module.exports = roleWallRepairer;