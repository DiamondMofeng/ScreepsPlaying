import { moveToRoom } from "@/utils/util_beheavor";

/**
 * pionner将前往flag所在房间，采集资源并进行建造
 * @param {Creep} creep - 
 */
const role_remote_claimer = (creep) => {

  let workRoom = creep.memory.workRoom
  if (creep.room.name !== workRoom) {
    moveToRoom(creep, workRoom)
    return;
  }


  let controller = creep.room.controller


  if (controller.reservation && controller.reservation.username == 'Invader') {
    let attackResult = creep.attackController(controller)
    if (attackResult == ERR_NOT_IN_RANGE) {
      creep.moveTo(controller, { reusePath: 50 })
    }
    return
  }

  let reserveResult = creep.reserveController(controller)
  if (reserveResult == ERR_NOT_IN_RANGE) {
    creep.moveTo(controller, { reusePath: 50 })
  } else if (reserveResult == ERR_INVALID_TARGET) {

  }

}

export default role_remote_claimer

