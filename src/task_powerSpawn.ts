import _ from 'lodash'
import { moveAndWithdraw, moveAndTransfer } from "@/utils/util_beheavor"

/**
 * 
 * @param {Creep} creep 
 */
export const task_powerSpawn = (creep: Creep) => {

  if (creep.room.controller?.level ?? 0 <= 8) {
    return
  }

  if (creep.room.storage && creep.room.storage.store['energy'] < 100000) {
    return
  }

  const PS_ID = '_PS_ID'

  const MIN_POWER = 20  //PS低于此数值是进行填充

  if (_.isUndefined(creep.memory[PS_ID])) {
    let ps = creep.room.powerSpawn
    if (ps) {
      creep.memory[PS_ID] = ps.id
    }
    else {
      return
    }
  }

  let PS = Game.getObjectById(creep.memory[PS_ID])

  if (!PS) {
    return
  }

  if (PS.store.power < MIN_POWER
    && ((creep.room.terminal?.store[RESOURCE_POWER] ?? 0 > 100) || (creep.room.storage?.store[RESOURCE_POWER] ?? 0 > 1000) || creep.store[RESOURCE_POWER] > 0)
  ) {
    if (creep.store.getUsedCapacity(RESOURCE_POWER) == 0) {
      moveAndWithdraw(creep, creep.room.storage!, [RESOURCE_POWER], 100)
      moveAndWithdraw(creep, creep.room.terminal!, [RESOURCE_POWER], 100)
    }
    else {
      moveAndTransfer(creep, PS)
    }


    return 'return'




  }




}


