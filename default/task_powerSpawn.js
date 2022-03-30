const { moveAndWithdraw, moveAndTransfer } = require("./util_beheavor")


/**
 * 
 * @param {Creep} creep 
 */
const task_powerSpawn = (creep) => {

  if (creep.room.controller.level < 8) return

  const PS_ID = '_PS_ID'

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

  if (creep.room.terminal.store.power > 0
    && PS.store.power < 50
  ) {
    if (creep.store.getUsedCapacity() == 0) {
      moveAndWithdraw(creep, creep.room.terminal, [RESOURCE_POWER], 50)
    }
    else {
      moveAndTransfer(creep, PS)
    }


    return 'return'




  }




}



module.exports = { task_powerSpawn }