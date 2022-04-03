const { moveToRoom, tryCollectAnyEnergy, workingStatesKeeper } = require("./util_beheavor");
const { avoidSourceKeeper } = require("./util_costCallBacks");


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


  workingStatesKeeper(creep, () => tryCollectAnyEnergy(creep), () => {
    let cts = creep.room.find(FIND_CONSTRUCTION_SITES)
    if (cts.length > 0) {
      let ct = cts[0]
      if (creep.build(ct) == ERR_NOT_IN_RANGE) {
        creep.moveTo(ct, { reusePath: 50 })
      }
    }
  })


}

module.exports = role_expend_builder

