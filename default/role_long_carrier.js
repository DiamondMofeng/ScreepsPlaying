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

    if (pickUpNearbyDroppedEnergy(creep)) {
      return
    }

    //若有空余背包
    if (creep.store.getFreeCapacity() > 0) {
      moveAndWithdraw(creep, fromContainer)
      // console.log('debug')
    }
    else {
      moveAndTransfer(creep, toContainer)
      // console.log('debug2')

    }

    //添加修路逻辑

  }
}

module.exports = roleCarrier.run;


