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
const { moveAndWithdraw, moveAndTransfer, workingStatesKeeper } = require("./util_beheavor")
try {
  // playground.injectRoomTracker()
  // playground.test()

} catch (error) {

}

global.lastOnline = Game.time;  //增添趣味性，但是位置待整理

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


    // Game.spawns['W17N15_1'].spawnCreep(body([CARRY,MOVE],25),'1')

    let c = Game.creeps['1'];
    let lab_1 = Game.getObjectById('622384ea76cf3af999ef3eaf')
    let lab_2 = Game.getObjectById('622395a13e744f7c8714790a')
    workingStatesKeeper(c,
      () =>
        moveAndWithdraw(c, c.room.terminal, ['XZH2O'],),
      () =>
        // moveAndTransfer(c, c.room.terminal),
        moveAndTransfer(c, lab_2, ['XZH2O'],)
    )

    sendEnergy("W12N16", "W11N4", 80000)


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
  // if (Game.cpu.bucket == 10000) {
  //   Game.cpu.generatePixel();
  // }


}