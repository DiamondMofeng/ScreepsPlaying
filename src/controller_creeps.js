const Harvester = require('./role_harvester')
const HarvesterPlus = require('./role_harvesterPlus')
const Carrier = require('./role_carrier')
const Upgrader = require('./role_upgrader')
const Builder = require('./role_builder')
const Repairer = require('./role_repairer')
const Sweepper = require('./role_sweepper')

const base_Transferor = require('./role_base_transferor')

const remote_Carrier = require('./role_remote_carrier')
const remote_Claimer = require('./role_remote_claimer')
const remote_Harvester = require('./role_remote_harvester')

const Useless = require('./role_useless')

const Guardian = require('./role_guardian')

const RoomClaimer = require('./role_roomClaimer')


const Miner = require('./role_miner')


const { getBodyArray } = require('./util_helper')
const role_expend_builder = require('./role_expend_builder')
const role_expend_claimer = require('./role_expend_claimer')
const role_scavenger = require('./role_scavenger')
const powerCreep_new = require('./powerCreep_new')
const roleWallRepairer = require('./role_wallRepairer')
const C = require('./util_consts')




//* functions////////////////////////////////


const SHOW_CPU_CREEPS = C.config.SHOW_CPU_CREEPS

//! script_outerEnergyBase中存在对 pionner_leader 和 remoteBuilder 的控制！

const activePreSpawn = [
  // 'carrier',
  // 'base_transferor',
  // 'harvesterPlus',
]

const roleMap = {
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
}


/**
 * 
 * @param {Creep} creep 
 */
function addToSpawnQueueBeforeDead(creep) {
  creep.room.pushToSpawnQueue({
    name: creep.memory.role + Game.time,
    role: creep.memory.role,
    // memory: creep.memory,
    body: getBodyArray(creep),
    priority: C.ROLE_TO_PRIORITY[creep.memory.role],
  })
}


/**
 * 
 * @param {Creep} creep 
 * @returns 
 */
function checkShouldPreAddToSpawnQueue(creep) {
  if (creep.memory.preAddedToSpawnQueue) {
    return
  }
  if (creep.ticksToLive <= creep.body.length * 3) {
    addToSpawnQueueBeforeDead(creep)
    creep.memory.preAddedToSpawnQueue = true
  }
}

//*  /////////////////////////////MAIN入口////////////////////////////////////////////////////////////////////////////////////////

function controller_creeps() {

  let CPUcounts = []
  powerCreep_new()

  //* beheavor crontroller
  for (let creepName in Game.creeps) {
    try {


      let startCPU = Game.cpu.getUsed()

      const creep = Game.creeps[creepName]

      if (!creep.memory.role) {
        continue
      }

      //TODO 先放在这里，待整理

      if (activePreSpawn.includes(creep.memory.role)) {
        checkShouldPreAddToSpawnQueue(creep)
      }


      // *run
      roleMap[creep.memory.role](creep)

      let endCPU = Game.cpu.getUsed()

      if (SHOW_CPU_CREEPS) {
        CPUcounts.push({ creep: creep.name, cpu: endCPU - startCPU, roomName: creep.room.name })
      }


    } catch (e) {
      console.log('!!!!!!!!!ERROR FOUND IN ' + creep + ' CONTROLL!!!!!!' + e)
      console.log(e.stack)
    }
  }

  if (SHOW_CPU_CREEPS) {
    CPUcounts.sort((a, b) => a.cpu - b.cpu)
    _.forEach(CPUcounts, i => console.log(`CPU of ${i.creep} at ${i.roomName} : ${i.cpu}`))
  }


}

module.exports = controller_creeps;

