const Upgrader = require('./role_upgrader')
const { pickUpNearbyDroppedEnergy, moveAndWithdraw, moveAndTransfer } = require('./util_beheavor')



var roleCarrier = {

  /**
   * creep从指定容器搬运至另一指定容器
   * @param {Creep} creep
   * @param {String} fromContainer - id of from
   * @param {String} toContainer  - id of to
   * @returns 
   */
  run: function (creep, fromContainer, toContainer) {


    //若能量为空，置为获取能量状态
    if (creep.store.getUsedCapacity() == 0) {
      creep.memory.working = false
    }

    //若能量为满，置为工作状态
    if (creep.store.getFreeCapacity() == 0) {
      creep.memory.working = true
    }



    //若处于 获取能量状态：(此时应有：背包未满)
    if (!creep.memory.working) {

      //尝试捡周围掉落的能量
      pickUpNearbyDroppedEnergy(creep)
        

      moveAndWithdraw(creep, fromContainer)
      // console.log('debug')

    }

    //获取能量结束，开始工作直至背包清空


    else {

      moveAndTransfer(creep, toContainer)
      // console.log('debug2')

      //添加修路逻辑
      if (creep.room === fromContainer.room) {

        let roadsToRepair = creep.pos.findInRange(FIND_STRUCTURES, 2, { filter: s => s.structureType == STRUCTURE_ROAD && s.hits / s.hitsMax < 0.8 })
        if (roadsToRepair.length > 0) {
          creep.repair(roadsToRepair[0])
        }

      }
    }



  }
}

module.exports = roleCarrier.run;

