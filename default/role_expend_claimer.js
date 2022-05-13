
const { moveToRoom } = require("./util_beheavor");
const { avoidSourceKeeper } = require("./util_costCallBacks");

/**
 * 
 * @param {Creep} creep 
 * @returns 
 */
const role_expend_claimer = (creep) => {

  // if (creep.memory.manual === true && creep.memory.flagName) {
  //   if (!Game.flags[creep.memory.flagName]) {
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

  if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
    creep.moveTo(creep.room.controller, { reusePath: 5 })
  }

}

module.exports = role_expend_claimer

