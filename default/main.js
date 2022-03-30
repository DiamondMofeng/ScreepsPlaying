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



const proto_creep = require("./proto_creep")
const roomBuildingPlanner = require("./util_roomBuildingPlanner")
const claimNewRoom = require("./script_claimNewRoom")
const developNewRoom = require("./script_developRoom")
const { getCPUCost } = require("./util_helper")
const statsScanner = require("./util_statsScanner")

const findCache = require("./util_cache_find")()
const customPrototypes = require('./util_customPrototypes')()




module.exports.loop = function () {




  console.log(`----------${Game.time}----------`)
  console.log('Game.cpu.getUsed(): at start ', Game.cpu.getUsed());


  // let a1 = Game.cpu.getUsed()

  // customPrototypes()

  // let a2 = Game.cpu.getUsed()

  proto_creep()

  // let a3 = Game.cpu.getUsed()

  // console.log(a2 - a1)
  // console.log(a3 - a2)




  getCPUCost(controller_creeps)

  controller_buildings()

  controller_spawns('Spawn1')

  broadcaster()



  //!
  statsScanner();



  roleTagger('W12N16')
  roleTagger('W11N16')

  // getCPUCost(roomPlanner, 'W17N15')






  roomBuildingPlanner('expend1')



  // claimNewRoom('expend1', 'W12N16_1', 'W11N8')
  // claimNewRoom('expend2', 'W12N16_1', 'W9N7')




  // test.showFIndReslt()


  if (Game.cpu.bucket == 10000) {
    Game.cpu.generatePixel();
  }

  buildEnergyBase('W12N16_1', 'W12N17')
  buildEnergyBase('W12N16_1', 'W11N16')
  guardRoom('W11N16')
  guardRoom('W12N17')


  // try {
  developNewRoom('expend1', 'W11N8')
  // } catch (error) {

  // }

  // try {
  developNewRoom('expend2', 'W9N7')
  // } catch (error) {

  // }



  // buildEnergyBase('W17N15_0', 'W17N14')
  // guardRoom('W17N14')


  // cleanInvaderCore('W17N14', 'W17N15')


  console.log('Game.cpu.getUsed() this tick: ', Game.cpu.getUsed());




}