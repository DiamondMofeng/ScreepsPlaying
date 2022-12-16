import { workingStatesKeeper, getEnergyFromStorage } from "./util_beheavor";
import { TIME_INTERVAL_WALL_REPAIRER_RESELECT_TARGET } from "./util_consts";


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
      if (Game.time % TIME_INTERVAL_WALL_REPAIRER_RESELECT_TARGET == 0) {
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


export default roleWallRepairer;