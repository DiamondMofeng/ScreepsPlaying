/**
 * 保持creep数量。
 * !临时用
 * 
 */

const { evalBody_worker_halfEnergy, evalBody_harvester, evalBody_carrier_halfEnergy, evalBody_worker_fullEnergy, evalBodyByRole } = require("./spawn_evalBody")
const C = require("./util_consts")
const {
  // spawnByMinNumber,
  body } = require("./util_helper")



/*

roleCounts包括spawning,living,spawnQueue中的数量。

若房间中统计的指定roleCounts的creep数量小于minNumber，则counts+=1，并将指定role的creep推入spawnQueue


缓存部分：
由countCreepsByRole获取总的{room:{role:number}}对象。定时更新一次。



*/

const config = {
  wallRepairer: true,
}




/**
 * 统计全球的creep,role数量
 * @returns {Object} counts - {role: count}
 */
function countAllCreepsByRole() {

  let counts = global.creepCountsByRoom
  if (!counts || !counts.lastUpdate || Game.time - counts.lastUpdate >= C.TIME_INTERVAL_COUNT_CREEPS) {
    counts = _.groupBy(Object.values(Game.creeps), (creep) => creep.room.name);
    for (let roomName in counts) {
      counts[roomName] = _.countBy(counts[roomName], c => c.memory.role);
    }


    for (let roomName in Game.rooms) {
      if (!counts[roomName]) {
        counts[roomName] = {}
      }

      for (let creepToSpawn of Game.rooms[roomName].spawnQueue) {
        if (!counts[roomName][creepToSpawn.memory.role]) {
          counts[roomName][creepToSpawn.memory.role] = 0
        }
        counts[roomName][creepToSpawn.memory.role] += 1
      }
    }

    global.creepCountsByRoom = { ...counts, lastUpdate: Game.time }
  }

  return global.creepCountsByRoom

}


// /**
//  * 获取room内role的creep数量
//  * @param {Room} room 
//  */
// function getCreepCountsByRole(room) {

//   if (_.isUndefined(room.memory.creepCounts)
//     || _.isUndefined(room.memory.creepCounts.lastUpdate)
//     // || Game.time - room.memory.creepCounts.lastUpdate > C.TIME_INTERVAL_COUNT_CREEPS
//   ) {

//     room.memory.creepCounts = { ...countCreepsByRole(room), lastUpdate: Game.time }
//   }

//   if (room.memory.creepCounts) {
//     return room.memory.creepCounts
//   }
//   else {
//     // console.log(`unable to get creep counts for ${room}`)
//     return
//   }
// }

/**
 * 通过role获取creep的spawn优先级
 * @param {String} role 
 */
function getCreepSpawnPriorityByRole(role) {
  if (role.startsWith('harvester')) {
    return C.PRIORITY_SPAWN_HARVESTER
  }
  else if (role.startsWith('worker')) {
    return C.PRIORITY_SPAWN_WORKER
  }
  else if (role.startsWith('carrier')) {
    return C.PRIORITY_SPAWN_CARRIER
  }
  else if (role.startsWith('upgrader')) {
    return C.PRIORITY_SPAWN_UPGRADER
  }
  else if (role.startsWith('builder')) {
    return C.PRIORITY_SPAWN_BUILDER
  }
  else if (role.startsWith('repairer')) {
    return C.PRIORITY_SPAWN_REPAIRER
  }
  else if (role.startsWith('miner')) {
    return C.PRIORITY_SPAWN_MINER
  }
  else if (role.startsWith('base_transferor')) {
    return C.PRIORITY_SPAWN_BASE_TRANSFEROR
  }
}



/**
 * 
 * @param {Room|String} room 
 * @param {String} role 
 * @param {Number} minNumber 
 * @param {BodyPartDefinition[]} body
 */
function spawnByMinNumber(room, role, body = [], minNumber = 0) {
  // console.log(room)
  if (typeof room == 'string') {
    room = Game.rooms[room]
    if (!room) {
      console.log('spawnByMinNumber: room not found', room)
      return
    }
  }

  let counts = countAllCreepsByRole()

  if (!counts[room.name]) {
    console.log('spawnByMinNumber: room not found', room)
    return
  }

  if (counts[room.name][role] >= minNumber) {
    // console.log('spawnByMinNumber: already enough', role, minNumber)
    return
  }

  if (!counts[room.name][role]) {
    counts[room.name][role] = 0
  }
  counts[room.name][role] += 1



  if (!body.length) {
    body = evalBodyByRole(room.name, role)
  }
  // let name = role + Game.time
  let memory = {
    role: role,
  }
  let pushRes = room.pushToSpawnQueue({
    // name: name,
    body: body,
    memory: memory,
    priority: getCreepSpawnPriorityByRole(role)
  })
  // console.log(pushRes)
  console.log(`pushed ${role} to ${room}'s spawn queue`)
}



/**
 * 
 * @param {String} targetRoom 
 * @param {Object} opt 
 * @returns 
 */
const keepCreeps = (targetRoom, opt = {}) => {



  let room = Game.rooms[targetRoom]
  if (!room) {
    return
  }

  // let spawnName = targetRoom + '_0'  //TODO 到时候用生产队列代替
  // if (!Game.spawns[targetRoom]) {
  //   return
  // }

  let rcl = Game.rooms[targetRoom].controller.level
  switch (rcl) {
    case 1:
      spawnByMinNumber(targetRoom, 'upgrader', [WORK, MOVE, CARRY, MOVE], 3)

      break;
    case 2:

      spawnByMinNumber(targetRoom, 'upgrader', evalBody_worker_halfEnergy(targetRoom, { haveRoad: false }), 5)
      spawnByMinNumber(targetRoom, 'harvesterPlus', evalBody_harvester(targetRoom), 2)
      spawnByMinNumber(targetRoom, 'carrier', evalBody_carrier_halfEnergy(targetRoom), 2)

      if (room.cts && room.cts.length > 0) {
        spawnByMinNumber(targetRoom, 'builder', evalBody_worker_halfEnergy(targetRoom, { haveRoad: false }), 1)
      }



      break;
    case 3:

      spawnByMinNumber(targetRoom, 'upgrader', evalBody_worker_fullEnergy(targetRoom), 5)
      spawnByMinNumber(targetRoom, 'harvesterPlus', evalBody_harvester(targetRoom), 2)
      spawnByMinNumber(targetRoom, 'carrier', evalBody_carrier_halfEnergy(targetRoom), 2)

      if (room.cts && room.cts.length > 0) {
        spawnByMinNumber(targetRoom, 'builder', evalBody_worker_halfEnergy(targetRoom), 2)
      }


      break;
    case 4:





      spawnByMinNumber(targetRoom, 'upgrader', evalBody_worker_fullEnergy(targetRoom), 4)

      spawnByMinNumber(targetRoom, 'carrier', evalBody_carrier_halfEnergy(targetRoom), 2)

      spawnByMinNumber(targetRoom, 'harvesterPlus', evalBody_harvester(targetRoom), 2)

      if (room.cts && room.cts.length > 0) {
        spawnByMinNumber(targetRoom, 'builder', evalBody_worker_halfEnergy(targetRoom), 2)
      }



      break;
    case 5:

      spawnByMinNumber(targetRoom, 'upgrader', evalBody_worker_halfEnergy(targetRoom), 4)

      spawnByMinNumber(targetRoom, 'harvesterPlus', evalBody_harvester(targetRoom), 2)

      spawnByMinNumber(targetRoom, 'carrier', evalBody_carrier_halfEnergy(targetRoom), 2)

      spawnByMinNumber(targetRoom, 'base_transferor', evalBody_carrier_halfEnergy(targetRoom), 1)

      if (room.cts && room.cts.length > 0) {
        spawnByMinNumber(targetRoom, 'builder', evalBody_worker_halfEnergy(targetRoom), 2)
      }


      break;
    case 6:
      spawnByMinNumber(targetRoom, 'upgrader', evalBody_worker_halfEnergy(targetRoom), 4)

      spawnByMinNumber(targetRoom, 'harvesterPlus', evalBody_harvester(targetRoom), 2)

      spawnByMinNumber(targetRoom, 'carrier', evalBody_carrier_halfEnergy(targetRoom), 2)

      spawnByMinNumber(targetRoom, 'base_transferor', evalBody_carrier_halfEnergy(targetRoom), 1)

      if (room.mineral.mineralAmount > 0) {
        spawnByMinNumber(targetRoom, 'miner', evalBody_worker_halfEnergy(targetRoom), 1)
      }

      if (room.cts && room.cts.length > 0) {
        spawnByMinNumber(targetRoom, 'builder', evalBody_worker_halfEnergy(targetRoom), 2)
      }


      break;
    case 7:
      spawnByMinNumber(targetRoom, 'upgrader', body([WORK, 20, CARRY, 2, MOVE, 11]), 2)
      spawnByMinNumber(targetRoom, 'harvesterPlus', evalBody_harvester(targetRoom), 2)
      spawnByMinNumber(targetRoom, 'carrier', evalBody_carrier_halfEnergy(targetRoom), 1)
      spawnByMinNumber(targetRoom, 'base_transferor', evalBody_carrier_halfEnergy(targetRoom), 1)

      if (room.mineral.mineralAmount > 0) {
        spawnByMinNumber(targetRoom, 'miner', evalBody_worker_halfEnergy(targetRoom), 1)
      }

      if (room.cts && room.cts.length > 0) {
        spawnByMinNumber(targetRoom, 'builder', evalBody_worker_halfEnergy(targetRoom), 2)
      }
      break;

    case 8:
      // console.log("run here")
      spawnByMinNumber(targetRoom, 'upgrader', body([WORK, 1, CARRY, 1, MOVE, 1]), 1)
      spawnByMinNumber(targetRoom, 'harvesterPlus', evalBody_harvester(targetRoom), 2)
      spawnByMinNumber(targetRoom, 'carrier', evalBody_carrier_halfEnergy(targetRoom), 1)
      spawnByMinNumber(targetRoom, 'base_transferor', evalBody_carrier_halfEnergy(targetRoom), 1)
      if (room.mineral.mineralAmount > 0) {
        spawnByMinNumber(targetRoom, 'miner', evalBody_worker_halfEnergy(targetRoom), 1)
      }

      if (room.cts && room.cts.length > 0) {
        spawnByMinNumber(targetRoom, 'builder', evalBody_worker_halfEnergy(targetRoom), 2)
      }


      if (config.wallRepairer) {
        spawnByMinNumber(targetRoom, 'wallRepairer', body([CARRY, MOVE], 10, WORK, 10), 1)
      }


      break;
  }
}

module.exports = keepCreeps