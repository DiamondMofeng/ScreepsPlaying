import { moveToRoom, workingStatesKeeper } from "./util_beheavor"


/**
 * 
 * @param {Creep} creep 
 */
const role_scavenger = (creep) => {

  workingStatesKeeper(creep, () => {
    if (!moveToRoom(creep, creep.memory.workRoom, true)) return
    let ruins = creep.room.find(FIND_RUINS)
    let resources = creep.room.find(FIND_DROPPED_RESOURCES)


    // if (!Game.getObjectById(creep.memory.target)) {
    //   creep.memory.target == undefined
    // }
    let target = undefined

    // if(!creep.memory.target||!Game.getObjectById(creep.memory.target))
    // if (ruins.length > 0) {

    //   grouped_ruins = _.groupBy(ruins, r => r.structure.structureType)


    //   if (grouped_ruins[STRUCTURE_TERMINAL].length > 0) {
    //     target = grouped_ruins[STRUCTURE_TERMINAL][0]
    //   } else if (grouped_ruins[STRUCTURE_STORAGE].length > 0)
    //     target = grouped_ruins[STRUCTURE_STORAGE][0]


    // }

    if (resources.length > 0 && !target)
      if (!target) {
        grouped_resources = _.groupBy(resources, r => r.resourceType)
        console.log('grouped_resources: ', grouped_resources);

        for (const type of RESOURCES_ALL.reverse()) {
          console.log('type: ', type);
          if (grouped_resources[type] && grouped_resources[type].length > 0) {
            target = grouped_resources[type][0]

          }
        }
      }
    if (target) {
      // for (type in target.store.reverse()) {
      if (
        // creep.withdraw(target, type) == ERR_NOT_IN_RANGE ||
        creep.pickup(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target)
        // break;
      }
      // return
    }
  },
    () => {
      moveToRoom(creep, creep.memory.spawnRoom)
      for (const type in creep.store) {
        if (creep.transfer(creep.room.storage, type) == ERR_NOT_IN_RANGE) {
          creep.moveTo(creep.room.storage);
          break;
        }
      }
    }


  )








}

export default role_scavenger