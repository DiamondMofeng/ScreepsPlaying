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



/**
 * 
 * @param {Room} room 
 * @returns {Object} counts - {role: count}
 */
function countCreepsByRole(room) {
  let counts = {}
  //统计现有的creeps
  for (let creep of room.find(FIND_MY_CREEPS)) {
    if (!counts[creep.memory.role]) {
      counts[creep.memory.role] = 0
    }
    counts[creep.memory.role] += 1
  }

  //统计spawn队列中的creeps
  for (let creep of room.spawnQueue) {
    if (!counts[creep.memory.role]) {
      counts[creep.memory.role] = 0
    }
    counts[creep.memory.role] += 1
  }
  return counts

  // if (!global.creepCountsByRoom || Game.time % C.TIME_INTERVAL_COUNT_CREEPS == 0) {
  //   global.creepCountsByRoom = _.groupBy(Game.creeps, (creep) => creep.room)
  //   for (let room in Object.values(global.creepCountsByRoom)) {
  //     global.creepCountsByRoom[room] = _.groupBy(global.creepCountsByRoom[room], c => c.memory.role)
  //   }
  // }

  // return global.creepCountsByRoom[room]

}


/**
 * 
 * @param {Room} room 
 */
function getCreepCountsByRole(room) {



  if (Game.time % C.TIME_INTERVAL_COUNT_CREEPS == 0 || !room.memory.creepCounts) {
    room.memory.creepCounts = countCreepsByRole(room)
  }

  if (room.memory.creepCounts) {
    return room.memory.creepCounts
  }

}

/**
 * 
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

  // console.log('getCreepCountsByRole(room)[role]: ', getCreepCountsByRole(room)[role]);
  // console.log('minNumber: ', minNumber);
  if (getCreepCountsByRole(room)[role] >= minNumber) {
    // console.log('spawnByMinNumber: already enough', role, minNumber)
    return
  }
  getCreepCountsByRole(room)[role] += 1


  if (!body.length) {
    body = evalBodyByRole(room.name, role)
  }
  // let name = role + Game.time
  let memory = { role: role }
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

      spawnByMinNumber(targetRoom, 'upgrader', evalBody_worker_halfEnergy(targetRoom), 5)
      spawnByMinNumber(targetRoom, 'harvesterPlus', evalBody_harvester(targetRoom), 2)
      spawnByMinNumber(targetRoom, 'carrier', evalBody_carrier_halfEnergy(targetRoom), 2)

      if (room.cts && room.cts.length > 0) {
        spawnByMinNumber(targetRoom, 'builder', evalBody_worker_halfEnergy(targetRoom), 2)
      }


      break;
    case 4:





      spawnByMinNumber(targetRoom, 'upgrader', evalBody_worker_halfEnergy(targetRoom), 4)

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

      break;
  }
}

module.exports = keepCreeps