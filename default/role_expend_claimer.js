
const { moveToRoom } = require("./util_beheavor")

/**
 * 
 * @param {Creep} creep 
 * @returns 
 */
const role_expend_claimer = (creep) => {

  moveToRoom(creep, creep.memory.workRoom, true);

  if (creep.room.name !== creep.memory.workRoom) {
    return
  }

  //* 已到达目标房间

  if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
    creep.moveTo(creep.room.controller, { reusePath: 50 })
  }
 
}

module.exports = role_expend_claimer

