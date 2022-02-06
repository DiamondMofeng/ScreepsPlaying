const controller_creeps = require("./controller_creeps")
const controller_spawns = require('./controller_spawns')

const broadcaster = require('./util_broadcast')
const test = require('./test')

module.exports.loop = function () {
  //   Game.spawns['Spawn1'].spawnCreep([MOVE, CARRY, WORK], 'harvester' + Game.time, { memory: { role: 'harvester' } })
  console.log(`----------${Game.time}----------`)


  controller_creeps()
  controller_spawns()

  broadcaster()


  //////test part
  // test(Game.creeps['harvester35653212'])
}