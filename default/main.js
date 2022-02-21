const controller_creeps = require("./controller_creeps")
const controller_buildings = require("./controller_buildings")
const controller_spawns = require('./controller_spawns')

const broadcaster = require('./util_broadcast')
const roleTagger = require("./util_roleTagger")

const attack = require('./attack_commend')
const test = require('./test')
const buildEnergyBase = require('./script_outerEnergyBase_byRoom')

const guardRoom = require('./util_guardRoom')

const customPrototypes = require('./util_customPrototypes')
const roomPlanner = require("./util_roomPlanner")

module.exports.loop = function () {
  console.log(`----------${Game.time}----------`)

  

  customPrototypes()



  controller_creeps()
  controller_buildings('W12N16')
  controller_spawns('Spawn1')

  broadcaster()

  roleTagger('W12N16')
  roleTagger('W11N16')

  // attack()



  guardRoom('W11N16')

  // test.showFIndReslt()



  if (Game.cpu.bucket == 10000) {
    Game.cpu.generatePixel();
  }

  guardRoom('W12N17')
  buildEnergyBase('Spawn1','W12N17')

  console.log('Game.cpu.getUsed(): ', Game.cpu.getUsed());


roomPlanner('W17N15')


}