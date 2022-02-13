const Harvester = require('./role_harvester')
const Builder = require('./role_builder')

/**
 * pionner将前往flag所在房间，采集资源并进行建造
 * @param {Creep} creep - 
 * @param {string} flagName
 */
const role_long_pioneer = (creep, flagName) => {

  let targetRoom = creep.memory.pionner_targetRoom


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

module.exports = role_long_pioneer

