const { moveToRoom } = require("./util_beheavor")

/**
 * pionner将前往flag所在房间，采集资源并进行建造
 * @param {Creep} creep - 
 */
const role_remote_claimer = (creep) => {

  let workRoom = creep.memory.workRoom
  if (creep.room.name !== workRoom) {
    moveToRoom(creep, workRoom)
  }

  else if (creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
    creep.moveTo(creep.room.controller, { reusePath: 50 })
  }

}

module.exports = role_remote_claimer

