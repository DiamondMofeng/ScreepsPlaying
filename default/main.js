const controller_creeps = require("./controller_creeps")
const controller_buildings = require("./controller_buildings")
const controller_spawns = require('./controller_spawns')

const broadcaster = require('./util_broadcast')
const roleTagger = require("./util_roleTagger")

const attack = require('./attack_commend')
const test = require('./test')
const buildEnergyBase = require('./script_outerEnergyBase_byRoom')

const guardRoom = require('./util_guardRoom')

const roomPlanner = require("./util_roomPlanner")
const { cleanInvaderCore } = require("./script_invaderCore")



const roomBuildingPlanner = require("./util_roomBuildingPlanner")
const claimNewRoom = require("./script_claimNewRoom")
const developNewRoom = require("./script_developRoom")
const { getCPUCost } = require("./util_helper")
const statsScanner = require("./util_statsScanner")

const findCache = require("./util_cache_find")()
const customPrototypes = require('./util_customPrototypes')()

const proto_creep = require("./proto_creep")
proto_creep()

const mountAll = require("./mountAll")
mountAll()

const keepCreeps = require("./spawn_keepCreeps")

const playground = require("./test_playground")
const worldVisual = require("./util_worldVisual")
try {
  // playground.injectRoomTracker()
  // playground.test()

} catch (error) {

}


module.exports.loop = function () {



  console.log(`----------${Game.time}----------`)
  console.log('Game.cpu.getUsed(): at start ', Game.cpu.getUsed());



  try {
    // playground.injectRoomTracker()
    // playground.test()
    // playground.temp()


    let lowest = "E28N3"
    for (let room in Memory.stats.energy) {
      if (Memory.stats.energy[room] < Memory.stats.energy[lowest] && ["W12N16", "W17N15", "W9N7"].indexOf(room) == -1) {
        lowest = room;
      }

    }
    sendEnergy('W12N16', lowest, 75000)
    sendEnergy('W17N15', lowest, 75000)






  } catch (error) {

  }


  getCPUCost(controller_creeps)

  getCPUCost(controller_buildings)

  controller_spawns('Spawn1')

  broadcaster()

  //!


  roleTagger('W12N16')
  roleTagger('W11N16')

  // getCPUCost(roomPlanner, 'W17N15')

  roomBuildingPlanner('expend1')


  // claimNewRoom('expand3', 'W17N15_0', 'W15N15')


  if (Game.cpu.bucket == 10000) {
    Game.cpu.generatePixel();
  }

  // buildEnergyBase('W12N16_1', 'W12N17')
  // guardRoom('W12N17')
  // buildEnergyBase('W12N16_1', 'W11N16')
  // guardRoom('W11N16')


  // try {
  developNewRoom('expend1', 'W11N8')
  developNewRoom('expend2', 'W9N7')

  keepCreeps('E28N3', {})
  keepCreeps('W17N15', {})

  getCPUCost(worldVisual)

  // buildEnergyBase('W17N15_0', 'W17N14')
  // guardRoom('W17N14')


  // cleanInvaderCore('W17N14', 'W17N15')



  statsScanner();
  console.log('Game.cpu.getUsed() this tick: ', Game.cpu.getUsed());




}