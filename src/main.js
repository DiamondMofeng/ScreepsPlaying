const controller_creeps = require("./controller_creeps")
const controller_buildings = require("./controller_buildings")

const broadcaster = require('./util_broadcast')

const { getCPUCost } = require("./util_helper")
const statsScanner = require("./util_statsScanner")


require("./util_cache_find")()
require('./util_customPrototypes')()

require("./mountAll")()

require('./helper_roomResources')

const keepCreeps = require("./spawn_keepCreeps")

const showVisuals = require("./util_visuals")
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
  for (const name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log('Clearing non-existing creep memory:', name);
    }
  }

  try {

    main_temp_commands()

  } catch (e) {
    // console.log(e)
    console.log(e.stack)

  }


  getCPUCost(controller_creeps)

  getCPUCost(controller_buildings)

  broadcaster()

  //!



  // try {

  for (let roomName in Game.rooms) {
    let room = Game.rooms[roomName]
    if (!room || !room.controller || !room.controller.my) {
      continue
    }
    keepCreeps(roomName, {})
  }

  // showVisuals()   //* VISUAL所有的主入口

  statsScanner();
  console.log('Game.cpu.getUsed() this tick: ', Game.cpu.getUsed());

  //* 暂停产出pixel
  // if (Game.cpu.bucket == 10000) {
  //   if (Game.cpu.generatePixel) {
  //     Game.cpu.generatePixel();
  //   }
  // }


}