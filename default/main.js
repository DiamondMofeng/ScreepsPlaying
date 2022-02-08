const controller_creeps = require("./controller_creeps")
const controller_towers = require("./controller_towers")
const controller_spawns = require('./controller_spawns')

const broadcaster = require('./util_broadcast')
const test = require('./test')
const roleTagger = require("./util_roleTagger")

const attack = require('./attack_commend')

module.exports.loop = function () {
  //   Game.spawns['Spawn1'].spawnCreep([MOVE, CARRY, WORK], 'harvester' + Game.time, { memory: { role: 'harvester' } })
  console.log(`----------${Game.time}----------`)

  // test.trans1(Game.getObjectById('62029a95302000f912843c34'))
  // test.trans2(Game.getObjectById('62029a95302000f912843c34'))

  roleTagger('W12N16')

  controller_creeps()
  controller_towers()
  controller_spawns()

  broadcaster()





  // attack()


  if (Game.cpu.bucket == 10000) {
    Game.cpu.generatePixel();
  }


}