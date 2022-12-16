/*
思路：赋予room一个状态 in memory
    ? 暂时命名为inDanger
    不断检测inDanfer状态，
    若为true，则：基地派出attacker；room中所有creep尝试逃离敌人
*/

import { body } from "@/utils/util_helper"

//! //////////// HARD CODED /////////////
/**
 * baseID = "Spawn1",
 */
let guardRoom = (roomName, opts = { spawnName: 'Spawn1', broadcast: true }) => {


  let roomTW = Game.rooms[roomName] //Means room to watch

  let RM = Memory.rooms[roomName]



  // // * Default opt:



  //* 判断是否InDanger

  if (!_.isUndefined(roomTW)) {


    let hostileAttackers = roomTW.find(FIND_HOSTILE_CREEPS
      , {
        filter: HC => HC.getActiveBodyparts(ATTACK) != 0
          || HC.getActiveBodyparts(RANGED_ATTACK) != 0
          || HC.owner.username !== 'Appassionata' //! 临时白名单
      })

    if (hostileAttackers.length > 0) {
      RM.inDanger = true
    } else {
      RM.inDanger = false
    }

  }
  //* IF InDanger:

  if (RM.inDanger === true) {

    //* 广播
    if (opts.broadcast == true) {
      console.log(`!!!!!!!!!!!!!!!!!   ${roomTW} is in DANGER  !!!!!!!!!!!!!!!!!!!!!`)
    }
    //* 基地造兵支援

    //造个旗子方便guardian寻路
    let flagName = 'Guard' + roomName
    let flagTG = Game.flags[flagName]
    if (_.isUndefined(flagTG)) {
      roomTW.createFlag(25, 25, flagName)
    }


    let hasGuardian = false


    for (const creepName in Game.creeps) {
      let creep = Game.creeps[creepName]
      let CM = creep.memory
      if (CM.role == 'guardian' && CM.guardian_Room == roomName) {
        hasGuardian = true

      }
    }
    // console.log('hasGuardian: ', hasGuardian);


    if (hasGuardian == false) {

      let guardianName = 'guardian' + roomName + Game.time
      let spawnResult = Game.spawns[opts.spawnName].spawnCreep(body([TOUGH, 5, MOVE, 14, ATTACK, 10, MOVE, 1]),

        guardianName,
        {
          memory: {
            role: 'guardian',
            guardian_Room: roomName,
            guardian_FlagName: flagName,
            spawnName: opts.spawnName
          }
        })
      // console.log('spawnResult: ', spawnResult);
    }

    //* worker逃命
    for (const creepName in Game.creeps) {
      let creep = Game.creeps[creepName]
      //* 若此creep在inDanger房间内，且无还手之力

      function isBattleable(creep) {
        for (let part of creep.body) {
          if (part.type == ATTACK || part.type == RANGED_ATTACK) {
            return true
          }
        }
        return false
      }

      if (creep.room == roomTW
        && !isBattleable(creep)) {


        //* 建立一个fleed数组存放逃走的creep，方便后续恢复role
        if (_.isUndefined(RM.guardSys_fleedCreeps)) {
          RM.guardSys_fleedCreeps = []
        }
        if (RM.guardSys_fleedCreeps.indexOf(creepName) == -1) {
          RM.guardSys_fleedCreeps.push(creepName)
        }

        if (_.isUndefined(creep.memory.roleBeforeFlee)) {
          creep.memory.roleBeforeFlee = creep.memory.role
        }

        // creep.memory.role = 'fleer'
        creep.memory.flee = true  //为flee 接口做准备，现在还没写
        creep.memory.fleeFrom = roomName



      }
      if (creep.memory.flee == true) {
        function fleeTo(creep, destination) {
          creep.moveTo(destination, { range: 2 })
        }
        fleeTo(creep, Game.flags['FleeTo'])
      }
    }

  }
  else {
    if (_.isUndefined(RM.guardSys_fleedCreeps)) {
      RM.guardSys_fleedCreeps = []
    }
    //* inDanger解除后恢复职业
    while (RM.guardSys_fleedCreeps.length > 0) {
      let creepName = RM.guardSys_fleedCreeps.pop()

      let creep = Game.creeps[creepName]
      //* 数组中已不存在的creep
      if (_.isUndefined(creep)) {
        continue
      }
      else {
        creep.memory.role = creep.memory.roleBeforeFlee

        creep.memory.flee = false

        creep.memory.fleeFrom = null
      }

    }
  }
}
export default guardRoom