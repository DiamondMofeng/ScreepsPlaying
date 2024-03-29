import Harvester from './creeps/role_harvester'
import HarvesterPlus from './creeps/role_harvesterPlus'
import Carrier from './creeps/role_carrier'
import Upgrader from './creeps/role_upgrader'
import Builder from './creeps/role_builder'
import Repairer from './creeps/role_repairer'
import Sweepper from './creeps/role_sweepper'

import base_Transferor from './creeps/role_base_transferor'

import remote_Carrier from './creeps/role_remote_carrier'
import remote_Claimer from './creeps/role_remote_claimer'
import remote_Harvester from './creeps/role_remote_harvester'

import Useless from './creeps/role_useless'

import Guardian from './creeps/role_guardian'

import RoomClaimer from './creeps/role_roomClaimer'


import Miner from './creeps/role_miner'


// import { getBodyArray } from '@/utils/util_helper'
import role_expend_builder from './creeps/role_expend_builder'
import role_expend_claimer from './creeps/role_expend_claimer'
import role_scavenger from './creeps/role_scavenger'
import roleWallRepairer from './creeps/role_wallRepairer'

import powerCreep_new from './powerCreeps/powerCreep_new'
import { errorIsolater } from '@/utils/util_helper'
import { TaskTransporter } from '@/tasks/transport/taskTransporter'
import { config } from '@/utils/consts'



//* functions////////////////////////////////


const SHOW_CPU_CREEPS = config.SHOW_CPU_CREEPS

//! script_outerEnergyBase中存在对 pionner_leader 和 remoteBuilder 的控制！

// const activePreSpawn = [
//   // 'carrier',
//   // 'base_transferor',
//   // 'harvesterPlus',
// ]



const roleMap: Record<CreepRole, (creep: Creep) => void> = {
  //* core
  harvester: Harvester,
  harvesterPlus: HarvesterPlus,

  carrier: Carrier,
  base_transferor: base_Transferor,

  upgrader: Upgrader,
  builder: Builder,

  miner: Miner,

  //* expand
  expend_builder: role_expend_builder,
  expend_claimer: role_expend_claimer,

  //* others
  wallRepairer: roleWallRepairer,
  repairer: Repairer,

  //* ????
  sweepper: Sweepper,
  remote_carrier: remote_Carrier,
  remote_claimer: remote_Claimer,
  remote_harvester: remote_Harvester,
  useless: Useless,
  guardian: Guardian,
  roomClaimer: RoomClaimer,
  scavenger: role_scavenger,

  task_transporter: TaskTransporter
}


// /**
//  * 
//  * @param {Creep} creep 
//  */
// function addToSpawnQueueBeforeDead(creep) {
//   creep.room.pushToSpawnQueue({
//     name: creep.memory.role + Game.time,
//     role: creep.memory.role,
//     // memory: creep.memory,
//     body: getBodyArray(creep),
//     priority: ROLE_TO_PRIORITY[creep.memory.role],
//   })
// }


// /**
//  * 
//  * @param {Creep} creep 
//  * @returns 
//  */
// function checkShouldPreAddToSpawnQueue(creep) {
//   if (creep.memory.preAddedToSpawnQueue) {
//     return
//   }
//   if (creep.ticksToLive <= creep.body.length * 3) {
//     addToSpawnQueueBeforeDead(creep)
//     creep.memory.preAddedToSpawnQueue = true
//   }
// }

//*  /////////////////////////////MAIN入口////////////////////////////////////////////////////////////////////////////////////////
/**
 * 控制所有creep的主入口
 */
function controller_creeps() {

  let CPUcounts = []

  errorIsolater(() => powerCreep_new())

  //* beheavor crontroller
  for (let creepName in Game.creeps) {
    try {


      let startCPU = Game.cpu.getUsed()

      const creep = Game.creeps[creepName]

      if (!creep.memory.role || !Object.prototype.hasOwnProperty.call(roleMap, creep.memory.role)) {
        continue
      }

      // *run
      roleMap[creep.memory.role](creep)
      //TODO 先放在这里，待整理

      // if (activePreSpawn.includes(creep.memory.role)) {
      //   checkShouldPreAddToSpawnQueue(creep)
      // }



      let endCPU = Game.cpu.getUsed()

      if (SHOW_CPU_CREEPS) {
        CPUcounts.push({ creep: creep.name, cpu: endCPU - startCPU, roomName: creep.room.name })
      }


    } catch (e: unknown) {
      if (e instanceof Error) {
        console.log(`!!!!!!!!!ERROR FOUND IN [${creepName}] CONTROLL!!!!!! ${e}`)
        console.log(e.stack)
      }
    }
  }

  if (SHOW_CPU_CREEPS) {
    CPUcounts.sort((a, b) => a.cpu - b.cpu)
    CPUcounts.forEach(info => console.log(`CPU of ${info.creep} at ${info.roomName} : ${info.cpu}`))
  }


}

export default controller_creeps;

