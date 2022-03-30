const { moveAndTransfer } = require("./util_beheavor")

function powerCreep_new() {
  for (pc of Object.values(Game.powerCreeps)) {

    renewPC(pc)
    enablePower(pc, pc.room.name)
    // console.log(pc.name)
    if (pc.powers[PWR_GENERATE_OPS]) {
      pc.usePower(PWR_GENERATE_OPS)
      // console.log('pc.usePower(PWR_GENERATE_OPS): ', pc.usePower(PWR_GENERATE_OPS));
      if (pc.store.getFreeCapacity(RESOURCE_OPS) == 0) {
        moveAndTransfer(pc, pc.room.storage, [RESOURCE_OPS])
      }


    }

  }

}

/**
 * 
 * @param {PowerCreep} pc 
 * @param {String} roomName 
 * @returns 
 */
function enablePower(pc, roomName) {
  if (!Game.rooms[roomName]) {
    return
  }
  if (pc.room.controller.isPowerEnabled == true) {
    return
  }

  if (pc.enableRoom(Game.rooms[roomName].controller) == ERR_NOT_IN_RANGE) {
    pc.moveTo(Game.rooms[roomName].controller)
  }

}

/**
 * 
 * @param {PowerCreep} pc 
 */
function renewPC(pc) {
  if (pc.ticksToLive < 500) {
    let powerSpawn = pc.room.find(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_POWER_SPAWN })[0]
    if (powerSpawn) {
      if (pc.renew(powerSpawn) == ERR_NOT_IN_RANGE) {
        pc.moveTo(powerSpawn)
      }
    }
  }
}

module.exports = powerCreep_new