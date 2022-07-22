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
const attack_dismental = require("./attack_dismental")
const attack_yitiji = require("./attack_yitiji")
const main_temp_commands = require("./main_temp_commands")
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
    main_temp_commands()
    // Game.spawns['w'].spawnCreep(body([WORK, MOVE], 25), '1')
    // Game.spawns['W17N15_0'].spawnCreep(body([WORK, MOVE], 25), '2')

    // let cpu1 = Game.cpu.getUsed()
    // let orders = Game.market.getAllOrders({ resourceType: RESOURCE_ENERGY, type: ORDER_BUY })
    // let cpu2 = Game.cpu.getUsed()
    // console.log(`orders:${orders.length} cpu:${cpu2 - cpu1}`)



    // attack_yitiji('W17N15', 'YTJ_1')
    // attack_dismental('W17N15', 'DIS_1')
    // attack_dismental('W17N15', 'DIS_2')


    // for (let name in ['1', '2']) {

    //   let creep = Game.creeps[name];
    //   if (!Game.creeps[name]) {
    //     continue;
    //   }
    //   creep.moveTo(Game.flags['DIS_1'])


    // }
    // let c1 = Game.creeps['2']
    // // // .moveTo(Game.flags['DIS_1'])
    // console.log(c1)
    // // c1.moveTo(Game.flags['DIS_1'])
    // console.log('c1.moveTo(Game.fl: ', c1.moveTo(Game.flags['DIS_1']));


    // Game.spawns['W17N15_1'].spawnCreep(body([CARRY,MOVE],25),'1')

    // let c = Game.creeps['wallRepairer38965765'];
    // let lab_1 = Game.getObjectById('622384ea76cf3af999ef3eaf') //XGHO2
    // let lab_2 = Game.getObjectById('622395a13e744f7c8714790a')   //XZH2O
    // let lab_3 = Game.getObjectById('6230ebca989c0a15fca1c77c')  //XLHO2
    // let lab_4 = Game.getObjectById('62369d7c813e2d01d47cb71d')  //XZHO2
    // let lab_5 = Game.getObjectById('6231fc2f1f145966ef20b283')
    // let res = 'XZH2O'

    // moveAndWithdraw(c, c.room.terminal, [res])
    // moveAndTransfer(c, lab_2, [res])
    // moveAndTransfer(c, c.room.terminal)


  } catch (e) {
    // console.log(e)
    console.log(e.stack)

  }


  getCPUCost(controller_creeps)

  getCPUCost(controller_buildings)

  // controller_spawns('Spawn1')

  broadcaster()

  //!



  // try {

  // developNewRoom('expend1', 'W11N8')
  // developNewRoom('expend2', 'W9N7')

  // keepCreeps('W12N16', {})
  // keepCreeps('E28N3', {})
  // keepCreeps('W17N15', {})

  // keepCreeps('W11N4', {})

  // keepCreeps('E44S59', {})

  for (let roomName in Game.rooms) {
    let room = Game.rooms[roomName]
    if (!room || !room.controller || !room.controller.my) {
      continue
    }
    keepCreeps(roomName, {})
  }

  // showVisuals()   //* VISUAL所有的主入口

  // buildEnergyBase('W17N15_0', 'W17N14')
  // guardRoom('W17N14')


  // cleanInvaderCore('W17N14', 'W17N15')


  statsScanner();
  console.log('Game.cpu.getUsed() this tick: ', Game.cpu.getUsed());

  //* 暂停产出pixel
  // if (Game.cpu.bucket == 10000) {
  //   if (Game.cpu.generatePixel) {
  //     Game.cpu.generatePixel();
  //   }
  // }


}