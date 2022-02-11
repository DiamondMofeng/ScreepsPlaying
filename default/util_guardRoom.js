/*
思路：赋予room一个状态 in memory
    ? 暂时命名为inDanger
    不断检测inDanfer状态，
    若为true，则：基地派出attacker；room中所有creep尝试逃离敌人
*/

//! //////////// HARD CODED /////////////
/**
 * baseID = "Spawn1",
 */
let guardRoom = (roomName, opts = { spawnName: 'Spawn1', broadcast: true }) => {


  let roomTW = Game.rooms[roomName] //Means room to watch

  let RM = roomTW.memory



  // // * Default opt:



  //* 判断是否InDanger

  let hostileAttackers = roomTW.find(FIND_HOSTILE_CREEPS
    , {
      filter: HC => HC.body.indexOf(ATTACK) != -1
        || HC.body.indexOf(RANGED_ATTACK != -1)
    })

  if (hostileAttackers.length > 0) {
    RM.inDanger = true
  } else {
    RM.inDanger = false
  }

  //* IF InDanger:

  if (RM.inDanger === true) {

    //* 广播
    if (opts.broadcast == true) {
      console.log(`!!!!!!!!!!!!!!!!!   ${roomTW} is in DANGER  !!!!!!!!!!!!!!!!!!!!!`)
    }
    //* 基地造兵支援

    let hasGuardian = false

    for (creepName in Game.creeps) {
      let creep = Game.creeps[creepName]
      let CM = creep.memory
      if (CM.role == 'guardian' && CM.guardian_Room == roomName) {
        hasGuardian = true
      }
    }
    // console.log('hasGuardian: ', hasGuardian);
    if (hasGuardian == false) {
      let guardianName = 'guardian' + roomName
      Game.spawns[opts.spawnName].spawnCreep([TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE],
        guardianName,
        {
          memory: {
            role: 'guardian',
            guardian_Room: roomName,
            spawnName: opts.spawnName
          }
        })

    }

    //* worker逃命
    for (creepName in Game.creeps) {
      let creep = Game.creeps[creepName]
      //* 若此creep在inDanger房间内，且无还手之力
      if (creep.room == roomTW
        && (creep.body.indexOf(ATTACK) == -1 || creep.body.indexOf(RANGED_ATTACK) == -1)) {
        //* 建立一个fleed数组存放逃走的creep，方便后续恢复role
        if (_.isUndefined(RM.guardSys_fleedCreeps)) {
          RM.guardSys_fleedCreeps = []
        }
        RM.guardSys_fleedCreeps.push(creepName)


        creep.memory.flee = true  //为flee 接口做准备，现在还没写
        creep.memory.roleBeforeFlee = creep.memory.role
        creep.memory.fleeFrom = roomName

        function fleeTo(creep, destination) {
          creep.moveTo(destination)
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
module.exports = guardRoom