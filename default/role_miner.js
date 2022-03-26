const { setDoing, moveAndHarvest, moveAndTransfer } = require("./util_beheavor")


var roleMiner = {

  memoryConsts: {

  },

  /** @param {Creep} creep **/
  run: function (creep) {

    let CM = creep.memory

    if (_.isUndefined(CM.miner_mineID)) {
      let mine = creep.room.mineral
      CM.miner_mineID = mine.id
    }



    let state_mining = 'mining'
    let state_transfering = 'transfering'

    if (_.isUndefined(CM.doing)) {
      CM.doing = state_mining //初始化为mining
    }



    if (CM.doing == state_mining) {

      let mineral = Game.getObjectById(CM.miner_mineID)
      moveAndHarvest(creep, mineral)

      if (creep.store.getFreeCapacity() == 0) {
        setDoing(creep, state_transfering)
      }

    }
    else if (CM.doing == state_transfering) {

      let storage = creep.room.storage
      moveAndTransfer(creep, storage)

      if (creep.store.getUsedCapacity() == 0) {
        setDoing(creep, state_mining)
      }

    }




  }
}

module.exports = roleMiner.run;


