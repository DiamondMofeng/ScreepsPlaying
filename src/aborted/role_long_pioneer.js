import Harvester from './role_harvester'
import Builder from './role_builder'

/**
 * pionner将前往flag所在房间，采集资源并进行建造
 * @param {Creep} creep - 
 * @param {string} flagName
 */
const role_long_pioneer = (creep, flagName) => {

  if (creep.room != Game.flags[flagName].room) {
    creep.moveTo(Game.flags[flagName])
    return
  }


  if (creep.room.find(FIND_CONSTRUCTION_SITES).length) {
    Builder(creep, true)
  }
  else {
    Harvester(creep)
  }
}

export default role_long_pioneer

