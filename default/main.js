const controller_creeps = require("./controller_creeps")
const controller_buildings = require("./controller_buildings")
const controller_spawns = require('./controller_spawns')

const broadcaster = require('./util_broadcast')
const roleTagger = require("./util_roleTagger")

const attack = require('./attack_commend')
const test = require('./test')
const buildEnergyBase = require('./script_outerEnergyBase')

const guardRoom = require('./util_guardRoom')

const customPrototypes = require('./util_customPrototypes')

module.exports.loop = function () {

  console.log(`----------${Game.time}----------`)

  customPrototypes()


  controller_creeps()
  controller_buildings('W12N16')
  controller_spawns()

  // broadcaster()

  roleTagger('W12N16')
  roleTagger('W11N16')

  // attack()



  guardRoom('W11N16')

  // test.showFIndReslt()



  if (Game.cpu.bucket == 10000) {
    Game.cpu.generatePixel();
  }

  buildEnergyBase('findStarter', 'findEnder', 'Spawn1')
}