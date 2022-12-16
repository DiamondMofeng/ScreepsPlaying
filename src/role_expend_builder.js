import { moveToRoom, tryCollectAnyEnergy, workingStatesKeeper } from "./util_beheavor";
import { avoidSourceKeeper } from "./util_costCallBacks";

import roleUpgrader from "./role_upgrader";

/**
 * 
 * @param {Creep} creep 
 * @returns 
 */
const role_expend_builder = (creep) => {


  // if (creep.memory.manual === true && creep.memory.flagName) {
  //   if (!Game.flags[creep.memory.flagName]) {
  //     console.log(creep, '找不到', flagName)
  //     return
  //   }

  //   creep.moveTo(Game.flags[creep.memory.flagName], { costCallback: avoidSourceKeeper })
  //   return
  // }


  moveToRoom(creep, creep.memory.workRoom, true);

  if (creep.room.name !== creep.memory.workRoom) {
    return
  }

  //* 已到达目标房间
  let cts = creep.room.find(FIND_CONSTRUCTION_SITES)


  if (cts.length > 0) {
    workingStatesKeeper(creep,
      () => tryCollectAnyEnergy(creep),
      () => {
        let ct = cts[0]
        if (creep.build(ct) == ERR_NOT_IN_RANGE) {
          creep.moveTo(ct, { reusePath: 5, swampCost: 2 }) //防止出房间
        }
      })
  }
  else {
    roleUpgrader(creep)
  }

}




export default role_expend_builder

