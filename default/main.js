const controller_creeps = require("./controller_creeps")
const controller_buildings = require("./controller_buildings")
const controller_spawns = require('./controller_spawns')

const broadcaster = require('./util_broadcast')

const attack = require('./attack_commend')
const test = require('./test')

const buildEnergyBase = require('./script_outerEnergyBase_byRoom')
const guardRoom = require('./util_guardRoom')
const { cleanInvaderCore } = require("./script_invaderCore")
const claimNewRoom = require("./script_claimNewRoom")
const developNewRoom = require("./script_developRoom")

const { getCPUCost, body } = require("./util_helper")
const statsScanner = require("./util_statsScanner")


const findCache = require("./util_cache_find")()
const customPrototypes = require('./util_customPrototypes')()

const mountAll = require("./mountAll")
mountAll()

const keepCreeps = require("./spawn_keepCreeps")

const playground = require("./test_playground")

const showVisuals = require("./util_visuals")
try {
  // playground.injectRoomTracker()
  // playground.test()

} catch (error) {

}

module.exports.loop = function () {



  console.log(`----------${Game.time}----------`)
  console.log('Game.cpu.getUsed(): at start ', Game.cpu.getUsed());

  //*临时放到这里，到时候挪走
  //*clean the dead(experiod)
  for (var name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log('Clearing non-existing creep memory:', name);
    }
  }




  try {
    // playground.injectRoomTracker()
    // playground.test()
    // playground.temp()
    // claimNewRoom('claim_W11N4', 'W9N7_0', true)

    // let spawns = ['w', 'W17N15_0', 'W17N15_1'].map(name => Game.spawns[name])
    // for (let spawn of spawns) {
    //   spawn.spawnCreep(body([MOVE, 25, WORK, 15, CARRY, 10]), spawn.name)
    // }

    // let ccs = ['W17N15_0', 'W17N15_1', 'w'].map(name => Game.creeps[name])
    // for (let cc of ccs) {
    //   // if(cc.room.name==Game.flags['expand4'].name){
    //     cc.memory.role='expend_builder'
    //     continue
    //   // }

    //   cc.moveTo(Game.flags['expand4'], {
    //     reusePath: 50,
    //     ignoreCreeps: true,
    //   })
    // }



    // let lowest = "E28N3"
    // for (let room in Memory.stats.energy) {
    //   if (Memory.stats.energy[room] < Memory.stats.energy[lowest] && ["W12N16", "W17N15", "W9N7"].indexOf(room) == -1) {
    //     lowest = room;
    //   }

    // }
    // sendEnergy('W12N16', lowest, 75000)
    // sendEnergy('W17N15', lowest, 75000)






  } catch (error) {

  }


  getCPUCost(controller_creeps)

  getCPUCost(controller_buildings)

  // controller_spawns('Spawn1')

  broadcaster()

  //!



  // getCPUCost(roomPlanner, 'W17N15')



  // claimNewRoom('expand3', 'W17N15_0', 'W15N15')




  // buildEnergyBase('W12N16_1', 'W12N17')
  // guardRoom('W12N17')
  // buildEnergyBase('W12N16_1', 'W11N16')
  // guardRoom('W11N16')


  // try {
  developNewRoom('expend1', 'W11N8')
  developNewRoom('expend2', 'W9N7')

  keepCreeps('W12N16', {})
  keepCreeps('E28N3', {})
  keepCreeps('W17N15', {})

  keepCreeps('W11N4', {})

  keepCreeps('E44S59', {})

  showVisuals()   //* VISUAL所有的主入口

  // buildEnergyBase('W17N15_0', 'W17N14')
  // guardRoom('W17N14')


  // cleanInvaderCore('W17N14', 'W17N15')


  statsScanner();
  console.log('Game.cpu.getUsed() this tick: ', Game.cpu.getUsed());

  //* 暂停产出pixel
  if (Game.cpu.bucket == 10000) {
    Game.cpu.generatePixel();
  }


}