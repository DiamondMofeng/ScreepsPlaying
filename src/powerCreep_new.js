import { moveAndTransfer } from "@/utils/util_beheavor";

function powerCreep_new() {
  for (const pc of Object.values(Game.powerCreeps)) {

    // 若未出生则跳过
    if (!pc.room) {
      continue;
    }

    renewPC(pc)
    enablePower(pc, pc.room.name)
    // console.log(pc.name)
    if (pc.powers[PWR_GENERATE_OPS] && pc.powers[PWR_GENERATE_OPS].cooldown == 0) {
      pc.usePower(PWR_GENERATE_OPS)
      // console.log('pc.usePower(PWR_GENERATE_OPS): ', pc.usePower(PWR_GENERATE_OPS));
      if (pc.store.getFreeCapacity(RESOURCE_OPS) == 0) {
        moveAndTransfer(pc, pc.room.storage, [RESOURCE_OPS])
        continue;
      }
    }

    if (pc.powers[PWR_REGEN_SOURCE] && pc.powers[PWR_REGEN_SOURCE].cooldown == 0) {
      let sources = pc.room.find(FIND_SOURCES, {
        filter: s => s.effects == undefined
          || s.effects.every(e => e.effect !== PWR_REGEN_SOURCE)
          || s.effects.some(e => e.effect == PWR_REGEN_SOURCE && e.ticksRemaining < 30)
      })
      if (sources.length > 0) {
        if (pc.usePower(PWR_REGEN_SOURCE, sources[0]) == ERR_NOT_IN_RANGE) {
          pc.moveTo(sources[0])
          continue;
        }
      }
    }

    if (pc.powers[PWR_OPERATE_STORAGE] && pc.powers[PWR_OPERATE_STORAGE].cooldown == 0) {
      let storage = pc.room.storage
      if (storage) {
        if (pc.usePower(PWR_OPERATE_STORAGE, storage) == ERR_NOT_IN_RANGE) {
          pc.moveTo(storage)
          continue;
        }
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

export default powerCreep_new