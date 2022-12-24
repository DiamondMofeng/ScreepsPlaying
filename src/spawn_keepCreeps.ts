import _ from 'lodash'
import { evalBody_worker_halfEnergy, evalBody_harvester, evalBody_carrier_halfEnergy, evalBody_worker_fullEnergy, evalBodyByRole } from "./spawn_evalBody"
import { TIME_INTERVAL, SPAWN_PRIOTITY } from "@/utils/consts"
import { body } from "@/utils/util_helper"
import { useGlobalCache } from "./utils/hooks/useGlobalCache"

/**
 * 维护creep数量。若少于期望数量则推入对应房间的spawnQueue
 */


/*

roleCounts包括spawning,living,spawnQueue中的数量。

若房间中统计的指定roleCounts的creep数量小于minNumber，则counts+=1，并将指定role的creep推入spawnQueue


缓存部分：
由countCreepsByRole获取总的{room:{role:number}}对象。定时更新一次。



*/

const config = {
  wallRepairer: false,
  upgrader: true
}




// /**
//  * 统计全球的creep,role数量
//  * @returns {Object} counts - {role: count}
//  */
// function countAllCreepsByRole() {

//   let counts = global.creepCountsByRoom
//   if (!counts || !counts.lastUpdate || Game.time - counts.lastUpdate >= TIME_INTERVAL.COUNT_CREEPS) {
//     counts = _.groupBy(Object.values(Game.creeps), (creep) => creep.room.name);
//     for (let roomName in counts) {
//       counts[roomName] = _.countBy(counts[roomName], c => c.memory.role);
//     }


//     for (let roomName in Game.rooms) {
//       if (!counts[roomName]) {
//         counts[roomName] = {}
//       }

//       for (let creepToSpawn of Game.rooms[roomName].spawnQueue) {

//         if (!creepToSpawn.memory || !creepToSpawn.memory.role) {
//           continue;
//         }

//         if (!counts[roomName][creepToSpawn.memory.role]) {
//           counts[roomName][creepToSpawn.memory.role] = 0
//         }
//         counts[roomName][creepToSpawn.memory.role] += 1
//       }
//     }

//     global.creepCountsByRoom = { ...counts, lastUpdate: Game.time }
//   }

//   return global.creepCountsByRoom

// }

export const creepsCounterInitializer = () => {

  //count existing creeps
  let roomGroupedCreeps = _.groupBy(Object.values(Game.creeps), (creep) => creep.room.name);
  let counter = _.fromPairs(
    Object.entries(roomGroupedCreeps)
      .map(([roomName, creeps]) =>
        [roomName, _.countBy(creeps, c => c.memory.role)]
      )
  )


  //count creeps in spawnQueue
  for (let roomName in Game.rooms) {
    if (!counter[roomName]) {
      counter[roomName] = {}
    }

    for (let creepToSpawn of Game.rooms[roomName].spawnQueue) {

      if (!creepToSpawn?.memory?.role && !creepToSpawn.role) {
        continue;
      }

      let role = creepToSpawn.memory?.role || creepToSpawn.role

      counter[roomName][role] = (counter[roomName][role] ?? 0) + 1
    }
  }

  return counter

}

function countAllCreepsByRole() {
  return useGlobalCache('creepsCounter', creepsCounterInitializer, TIME_INTERVAL.COUNT_CREEPS)
}


/**
 * 通过role获取creep的spawn优先级
 * @param {CreepRole} role 
 */
function spawnPriorityOfRole(role: CreepRole) {
  return SPAWN_PRIOTITY[role] || 0
}


function spawnByMinNumber(
  room: Room | string,
  role: CreepRole,
  body: BodyPartConstant[] = [],
  minNumber = 0
) {
  // console.log(room)
  if (typeof room == 'string') {
    room = Game.rooms[room]
    if (!room) {
      console.log('spawnByMinNumber: room not found', room) //TODO: use warning logger
      return
    }
  }
  let counter = countAllCreepsByRole()

  if (!counter[room.name]) {
    console.log('spawnByMinNumber: room not found', room)  //TODO: use warning logger
    return
  }

  if (counter[room.name][role] >= minNumber) {
    // console.log('spawnByMinNumber: already enough', role, minNumber)
    return
  }

  if (!counter[room.name][role]) {
    counter[room.name][role] = 0
  }
  counter[room.name][role] += 1



  if (!body.length) {
    body = evalBodyByRole(room.name, role)
  }
  // let name = role + Game.time
  let memory = {
    role: role,
  }
  room.pushToSpawnQueue({
    // name: name,
    body: body,
    memory: memory,
    priority: spawnPriorityOfRole(role)
  })
  // console.log(pushRes)
  console.log(`pushed ${role} to ${room}'s spawn queue`)  //TODO: use info logger
}



const keepCreeps = (
  targetRoom: Room['name'],
  // opt = {}
) => {

  let room = Game.rooms[targetRoom]
  if (!room || !room.controller?.my) {  //? prevents spawnQueue in non owned room
    return
  }

  let rcl = room.controller.level
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
      // spawnByMinNumber(targetRoom, 'task_transporter', evalBody_carrier_halfEnergy(targetRoom), 2)

      // spawnByMinNumber(targetRoom, 'base_transferor', evalBody_carrier_halfEnergy(targetRoom), 1)

      if (room.cts && room.cts.length > 0) {
        spawnByMinNumber(targetRoom, 'builder', evalBody_worker_halfEnergy(targetRoom), 2)
      }


      break;
    case 6:
      spawnByMinNumber(targetRoom, 'upgrader', evalBody_worker_fullEnergy(targetRoom), 4)

      spawnByMinNumber(targetRoom, 'harvesterPlus', evalBody_harvester(targetRoom), 2)

      spawnByMinNumber(targetRoom, 'carrier', evalBody_carrier_halfEnergy(targetRoom), 2)

      spawnByMinNumber(targetRoom, 'base_transferor', evalBody_carrier_halfEnergy(targetRoom), 1)

      if ((room.mineral?.mineralAmount ?? 0) > 0) {
        spawnByMinNumber(targetRoom, 'miner', evalBody_worker_halfEnergy(targetRoom), 1)
      }

      if (room.cts && room.cts.length > 0) {
        spawnByMinNumber(targetRoom, 'builder', evalBody_worker_halfEnergy(targetRoom), 2)
      }


      break;
    case 7:

      if (room.storage && room.storage.store.energy > 2e5) {
        spawnByMinNumber(targetRoom, 'upgrader', body([WORK, 20, CARRY, 2, MOVE, 11]), 3)
      }
      else if (room.storage && room.storage.store.energy > 1e5) {
        spawnByMinNumber(targetRoom, 'upgrader', body([WORK, 20, CARRY, 2, MOVE, 11]), 2)
      }
      else {
        spawnByMinNumber(targetRoom, 'upgrader', body([WORK, 10, CARRY, 2, MOVE, 6]), 1)
      }

      spawnByMinNumber(targetRoom, 'harvesterPlus', evalBody_harvester(targetRoom), 2)
      spawnByMinNumber(targetRoom, 'carrier', evalBody_carrier_halfEnergy(targetRoom), 1)
      spawnByMinNumber(targetRoom, 'base_transferor', evalBody_carrier_halfEnergy(targetRoom), 1)

      if ((room.mineral?.mineralAmount ?? 0) > 0) {
        spawnByMinNumber(targetRoom, 'miner', evalBody_worker_halfEnergy(targetRoom), 1)
      }

      if (room.cts && room.cts.length > 0) {
        spawnByMinNumber(targetRoom, 'builder', evalBody_worker_halfEnergy(targetRoom), 2)
      }
      break;

    case 8:
      // console.log("run here")
      spawnByMinNumber(targetRoom, 'harvesterPlus', evalBody_harvester(targetRoom), 2)
      spawnByMinNumber(targetRoom, 'carrier', evalBody_carrier_halfEnergy(targetRoom), 1)
      spawnByMinNumber(targetRoom, 'base_transferor', evalBody_carrier_halfEnergy(targetRoom), 1)

      if ((room.mineral?.mineralAmount ?? 0) > 0) {
        if (room.storage && room.storage.store.getFreeCapacity() > 0.2 * 1000 * 1000) {
          spawnByMinNumber(targetRoom, 'miner', evalBody_worker_halfEnergy(targetRoom), 1)
        }
      }

      if (room.cts && room.cts.length > 0) {
        spawnByMinNumber(targetRoom, 'builder', evalBody_worker_halfEnergy(targetRoom), 2)
      }


      if (config.wallRepairer) {
        spawnByMinNumber(targetRoom, 'wallRepairer', body([[CARRY, MOVE, WORK], 15]), 1)
      } else {
        // spawnByMinNumber(targetRoom, 'wallRepairer', body([[CARRY, MOVE, WORK], 5]), 1)
      }

      if (config.upgrader) {
        if (room.storage && room.storage.store[RESOURCE_ENERGY] > 1e5) {
          spawnByMinNumber(targetRoom, 'upgrader', body([WORK, 15, CARRY, 1, MOVE, 6]), 1)
        }
        else {
          spawnByMinNumber(targetRoom, 'upgrader', body([WORK, 10, CARRY, 1, MOVE, 6]), 1)
        }
      }
      else
        if (room.controller.ticksToDowngrade < 150000) {
          spawnByMinNumber(targetRoom, 'upgrader', body([WORK, 1, CARRY, 1, MOVE, 1]), 1)
        }



      break;
  }
}

export default keepCreeps