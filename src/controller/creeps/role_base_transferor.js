import { moveAndWithdraw, moveAndTransfer, getEnergyFromStorage, setDoing } from '@/utils/util_beheavor'

import { task_powerSpawn } from '@/task_powerSpawn'

import task_factory from '@/task_factory'
import C from '@/utils/consts'

const { RM } = C




var role_base_transferor = {

  /**
   * creep从指定容器搬运至另一指定容器
   * @param {Creep} creep
   * @param {String} fromContainer - id of from
   * @param {String} toContainer  - id of to
   * @returns 
   */
  run: function (creep) {

    if (global.lastOnline && global.lastOnline > Game.time - 750) {
      creep.say('✔️ ONLINE', true)
    } else {
      creep.say('❌ OFFLINE', true)
    }

    // if (creep.ticksToLive < 500) {
    //   let spawn = Game.spawns[creep.memory.spawnName]
    //   if (spawn) {
    //     spawn.renewCreep(creep)
    //   }
    // }



    //* 基本任务：如果能源充足，则把能量从storage运到link里（link给upgrader送过去）
    //* 否则：仅把能量从link拿到storage里

    //* 此外：负责terminal的订单内容：保持terminal里能量最少50k。
    //? terminal里除能量外的其他资源送到storage里

    //把能量从link拿到storage:
    // workingStatesKeeper(creep, getEnergyFromNearbyLink(creep, { range: 2, minCap: 0 }), moveAndTransfer(creep.room.storage))



    const CM_LINKID_CONTROLLER = '_linkID_controller'
    const CM_LINKID_STORAGE = '_linkID_storage'

    let terminal = creep.room.terminal
    let storage = creep.room.storage

    if (_.isUndefined(creep.memory[CM_LINKID_STORAGE])) {
      for (const id in creep.room.memory[RM.LINKS]) {
        if (creep.room.memory[RM.LINKS][id].type == 'storage') {
          creep.memory[CM_LINKID_STORAGE] = id
        }
      }
    }
    let link_storage = Game.getObjectById(creep.memory[CM_LINKID_STORAGE])
    // console.log('link_storage: ', link_storage);


    if (_.isUndefined(creep.memory[CM_LINKID_CONTROLLER])) {
      for (const id in creep.room.memory[RM.LINKS]) {
        if (creep.room.memory[RM.LINKS][id].type == 'controller') {
          creep.memory[CM_LINKID_CONTROLLER] = id
        }
      }
    }
    let link_controller = Game.getObjectById(creep.memory[CM_LINKID_CONTROLLER])
    // console.log('link_controller: ', link_controller);


    //* 把化合物送到lab
    // let transferLab = false
    // let lab = Game.getObjectById('620a638d7a3c3562cf7103f6')
    // let resourceType = RESOURCE_CATALYZED_GHODIUM_ACID
    // if (transferLab && terminal.store.getUsedCapacity(resourceType) > 0 && lab.store.getFreeCapacity(resourceType) > 0) {
    //   if (creep.store.getUsedCapacity - creep.store[resourceType] > 0) {
    //     moveAndTransfer(creep, storage, RESOURCE_ENERGY);
    //     // console.log('moveAndTransfer(creep, storage, RESOURCE_ENERGY): ', moveAndTransfer(creep, storage, [RESOURCE_ENERGY]));
    //     return
    //   }
    //   if (creep.store.getFreeCapacity() > 0) {
    //     moveAndWithdraw(creep, terminal, [resourceType])
    //   }
    //   else {
    //     moveAndTransfer(creep, lab, [resourceType])
    //   }
    //   return
    // }

    //! 临时 把东西从storage搬到terminal
    // if (creep.room.name == 'W17N15') {

    //   let isTransfer = true
    //   let type = 'K'
    //   if (isTransfer) {
    //     moveAndWithdraw(creep, storage, [type])
    //     moveAndTransfer(creep, terminal)
    //     return
    //   }
    // }






    //! 临时：把原材料送到工厂
    let isFactory = false
    let factory = creep.room.factory
    let resourceType = RESOURCE_ENERGY
    if (isFactory && storage.store.getUsedCapacity(resourceType) > 0 && factory.store.getUsedCapacity(resourceType) < 10000) {
      if (creep.store.getUsedCapacity - creep.store[resourceType] > 0) {
        moveAndTransfer(creep, storage, RESOURCE_ENERGY);
        // console.log('moveAndTransfer(creep, storage, RESOURCE_ENERGY): ', moveAndTransfer(creep, storage, [RESOURCE_ENERGY]));
        return
      }
      if (creep.store.getFreeCapacity() > 0) {
        moveAndWithdraw(creep, storage, [resourceType])
      }
      else {
        moveAndTransfer(creep, factory, [resourceType])
      }
      return
    }



    //* Main////////////
    // //填充spawn的能量
    // let isFillSpawn = false
    // if (isFillSpawn) {
    //   let spawn = Game.spawns['Spawn1']
    //   if (spawn.store[RESOURCE_ENERGY] < 300) {
    //     getEnergyFromStorage(creep)
    //     moveAndTransfer(creep, spawn)
    //     return
    //   }
    // }

    //* Tasks
    if (task_powerSpawn(creep) == 'return') {
      setDoing(creep, 'power')
      return
    }

    if (task_factory(creep) == 'return') {
      setDoing(creep, 'factory')
      return
    }


    // console.log(link_storage && link_controller == undefined)
    if (link_storage && link_controller == undefined) {
      if (link_storage.store[RESOURCE_ENERGY] > 0) {
        setDoing(creep, 'link_storage -> storage')
        moveAndWithdraw(creep, link_storage, [RESOURCE_ENERGY])
        moveAndTransfer(creep, storage, [RESOURCE_ENERGY])
        return
      }
    }



    if (link_controller) {

      //在LINK，storage,terminal之间转运

      // storage-> link storage
      if (storage.store.getUsedCapacity(RESOURCE_ENERGY) > 100 * 1000 && link_controller.store[RESOURCE_ENERGY] < 300) {

        getEnergyFromStorage(creep)
        moveAndTransfer(creep, link_storage)
        // console.log(333);
        setDoing(creep, 'storage-> link storage')

        return

      }
      else if (link_storage.store[RESOURCE_ENERGY] >= 500 && link_controller.store[RESOURCE_ENERGY] > 400) {

        //link storage -> storage
        moveAndWithdraw(creep, link_storage)
        moveAndTransfer(creep, storage)
        creep.transfer(terminal, RESOURCE_ENERGY)

        // console.log(222);
        setDoing(creep, 'link storage -> storage')

        return
      }
      else if (terminal && terminal.store.getUsedCapacity(RESOURCE_ENERGY) < 75 * 1000
        && storage.store.getUsedCapacity(RESOURCE_ENERGY) > 50 * 1000) {

        //storage->terminal
        moveAndWithdraw(creep, storage)
        moveAndTransfer(creep, terminal)
        setDoing(creep, 'storage->terminal')

        return
      }


      // else {
      // moveAndWithdraw(creep, link_storage)
      // moveAndTransfer(creep, storage)
      // return
    }




    //* 保持terminal里面至多有100*1000能量

    if (terminal && terminal.store[RESOURCE_ENERGY] > 100000) {

      moveAndWithdraw(creep, terminal)
      moveAndTransfer(creep, storage)



      setDoing(creep, 'terminal->storage')

      return;
    }

    moveAndTransfer(creep, storage)
    setDoing(creep, 'idle')
    // //若能量为空，置为获取能量状态
    // if (creep.store.getUsedCapacity() == 0) {
    //   creep.memory.working = false
    // }

    // //若能量为满，置为工作状态
    // if (creep.store.getFreeCapacity() == 0) {
    //   creep.memory.working = true
    // }



    // //若处于 获取能量状态：(此时应有：背包未满)
    // if (!creep.memory.working) {

    //   //尝试捡周围掉落的能量
    //   pickUpNearbyDroppedEnergy(creep)


    //   moveAndWithdraw(creep, fromContainer)
    //   // console.log('debug')

    // }

    // //获取能量结束，开始工作直至背包清空


    // else {

    //   moveAndTransfer(creep, toContainer)

    // }



  }
}

export default role_base_transferor.run;


