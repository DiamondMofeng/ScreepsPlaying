const { pickUpNearbyDroppedEnergy, moveAndWithdraw, moveAndTransfer, workingStatesKeeper, getEnergyFromNearbyLink, getEnergyFromStorage } = require('./util_beheavor')




var role_base_transferor = {

  /**
   * creep从指定容器搬运至另一指定容器
   * @param {Creep} creep
   * @param {String} fromContainer - id of from
   * @param {String} toContainer  - id of to
   * @returns 
   */
  run: function (creep) {

    // creep.say('✔️ ONLINE',true)
    creep.say('❌ OFFLINE', true)

    if (creep.ticksToLive < 500) {
      let spawn = Game.spawns[creep.memory.spawnName]
      if (spawn) {
        spawn.renewCreep(creep)
      }
    }



    //* 基本任务：如果能源充足，则把能量从storage运到link里（link给upgrader送过去）
    //* 否则：仅把能量从link拿到storage里

    //* 此外：负责terminal的订单内容：保持terminal里能量最少50k。
    //? terminal里除能量外的其他资源送到storage里

    //把能量从link拿到storage:
    // workingStatesKeeper(creep, getEnergyFromNearbyLink(creep, { range: 2, minCap: 0 }), moveAndTransfer(creep.room.storage))
    let terminal = creep.room.terminal
    let storage = creep.room.storage
    let link_storage = Game.getObjectById('62041ae6638cf54110e7422d')
    let link_controller = Game.getObjectById('6209b6db0bd2bf4b0ce577eb')


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
    let isTransfer = false
    let type = 'U'
    if (isTransfer) {
      creep.withdraw(storage, type)
      creep.transfer(terminal, type)
      return
    }






    //! 临时：把原材料送到工厂
    let isFactory = false
    let factory = Game.getObjectById('622461be2f2a4a4840b6ee24')
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
    //填充spawn的能量
    let isFillSpawn = false
    if (isFillSpawn) {
      let spawn = Game.spawns['Spawn1']
      if (spawn.store[RESOURCE_ENERGY] < 300) {
        getEnergyFromStorage(creep)
        moveAndTransfer(creep, spawn)
        return
      }
    }


    //在LINK，storage,terminal之间转运
    if (creep.room.storage.store.getUsedCapacity(RESOURCE_ENERGY) > 70 * 1000) {


      if (link_controller.store.getUsedCapacity(RESOURCE_ENERGY) < 300) {

        // storage-> link storage
        getEnergyFromStorage(creep)
        creep.transfer(link_storage, RESOURCE_ENERGY)
        // console.log(333);

        // return

      } else if (link_storage.store.getUsedCapacity(RESOURCE_ENERGY) > 500) {

        //link storage -> storage
        moveAndWithdraw(creep, link_storage)
        moveAndTransfer(creep, storage)
        creep.transfer(terminal, RESOURCE_ENERGY)

        // console.log(222);

      } else if (terminal.store.getUsedCapacity(RESOURCE_ENERGY) < 200 * 1000) {

        //storage->terminal
        getEnergyFromStorage(creep)
        creep.transfer(terminal, RESOURCE_ENERGY)
      }


    }
    else {
      moveAndWithdraw(creep, link_storage)
      moveAndTransfer(creep, Game.getObjectById('62043cc4d55ca519e1a7db68'))
    }

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

module.exports = role_base_transferor.run;


