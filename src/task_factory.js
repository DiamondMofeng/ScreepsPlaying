import { moveAndTransfer, moveAndWithdraw } from "@/utils/util_beheavor"



const task_factory = (creep) => {

  const IS_WORK = false

  const FACTORY_ID = '_FACTORY_ID'

  // const MIN_FACTORY = 20  //FACTORY低于此数值是进行填充


  if (IS_WORK === false) {
    return
  }

  if (creep.room.controller.level < 8) {
    return
  }

  // if (creep.room.storage && creep.room.storage.store['energy'] < 100000) {
  //   return
  // }


  if (_.isUndefined(creep.memory[FACTORY_ID])) {
    let FACTORIES = creep.room.find(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_FACTORY })
    if (FACTORIES.length > 0) {
      let FACTORY = FACTORIES[0]
      creep.memory[FACTORY_ID] = FACTORY.id
    }
    else {
      return
    }
  }

  let factory = Game.getObjectById(creep.memory[FACTORY_ID])
  let storage = creep.room.storage
  let terminal = creep.room.terminal
  if (!factory) {
    return
  }



  //! work /////////////


  if (creep.room.name != 'W17N15') {
    return
  }

  if (factory.store[RESOURCE_BATTERY] < 200) {

    if (storage && storage.store[RESOURCE_BATTERY] > 0) {
      moveAndTransfer(creep, factory)
      moveAndWithdraw(creep, storage, [RESOURCE_BATTERY])
      return 'return'
    }

    if (terminal && terminal.store[RESOURCE_BATTERY] > 0) {
      moveAndTransfer(creep, factory)
      moveAndWithdraw(creep, terminal, [RESOURCE_BATTERY])
      return 'return'
    }

  }

  if (factory && factory.store[RESOURCE_ENERGY] > 1000) {
    moveAndTransfer(creep, storage)
    moveAndWithdraw(creep, factory, [RESOURCE_ENERGY])
    return 'return'
  }


  // if (FACTORY.store.getUsedCapacity(RESOURCE_ENERGY) < MIN_FACTORY &&
  //   (creep.room.terminal.store.energy > 0 || creep.room.storage.store.energy > 0 || creep.store.energy > 0)
  // ) {
  //   if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
  //     moveAndWithdraw(creep, creep.room.storage, [RESOURCE_ENERGY])
  //     moveAndWithdraw(creep, creep.room.terminal, [RESOURCE_ENERGY])
  //   }
  //   else {
  //     moveAndTransfer(creep, FACTORY)
  //   }
  // }
}

export default task_factory