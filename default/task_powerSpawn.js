const { moveAndWithdraw, moveAndTransfer } = require("./util_beheavor")


/**
 * 
 * @param {Creep} creep 
 */
const task_powerSpawn = (creep) => {

  if (creep.room.controller.level < 8) {
    return
  }

  const PS_ID = '_PS_ID'

  const MIN_POWER = 20  //PS低于此数值是进行填充

  if (_.isUndefined(creep.memory[PS_ID])) {
    let PSs = creep.room.find(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_POWER_SPAWN })
    if (PSs.length > 0) {
      let PS = PSs[0]
      creep.memory[PS_ID] = PS.id
    }
    else {
      return
    }
  }

  let PS = Game.getObjectById(creep.memory[PS_ID])

  if (!PS) {
    return
  }

  if (PS.store.power < MIN_POWER &&
    (creep.room.terminal.store.power > 0 || creep.room.storage.store.power > 0 || creep.store.power > 0)
  ) {
    if (creep.store.getUsedCapacity(RESOURCE_POWER) == 0) {
      moveAndWithdraw(creep, creep.room.storage, [RESOURCE_POWER])
      moveAndWithdraw(creep, creep.room.terminal, [RESOURCE_POWER])
    }
    else {
      moveAndTransfer(creep, PS)
    }


    return 'return'




  }




}



module.exports = { task_powerSpawn }