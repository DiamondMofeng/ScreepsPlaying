
import Builder from './role_builder'

/**
 * pionner将前往flag所在房间，采集资源并进行建造
 * @param {Creep} creep - 
 * @param {string} flagName
 */
const role_long_reserver = (creep, flagName) => {

  if (creep.room != Game.flags[flagName].room) {
    creep.moveTo(Game.flags[flagName])
    return
  }


  //main
  if (creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
    creep.moveTo(creep.room.controller)
  }

}

export default role_long_reserver

