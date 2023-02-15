import controller_creeps from "./controller/controller_creeps"
import controller_structures from "./controller/controller_structures"
import { controller_transportTasks } from "./controller/controller_transportTasks"

import broadcaster from '@/utils/util_broadcast'

import { getCPUCost } from "@/utils/util_helper"
import statsScanner from "@/utils/util_statsScanner"



import { mountAll } from "./mount/mountAll"
mountAll();

import keepCreeps from "./spawn_keepCreeps"

import main_temp_commands from "./main_temp_commands"

import { errorMapper } from "./errorMapper"
global.lastOnline = Game.time;  //增添趣味性，但是位置待整理

module.exports.loop = errorMapper(function () {//

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

  } catch (e: any) {
    // console.log(e)
    console.log(e.stack)

  }

  getCPUCost(controller_transportTasks)

  getCPUCost(controller_creeps)

  getCPUCost(controller_structures)

  broadcaster()

  //!



  // try {

  for (let roomName in Game.rooms) {
    let room = Game.rooms[roomName]
    if (!room || !room.controller || !room.controller.my) {
      continue
    }
    keepCreeps(roomName)
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


})