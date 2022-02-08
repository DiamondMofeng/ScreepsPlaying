const { getEnergyFromContainer, PriorizedTarget, targetsPriorizer_byRef, recycleSelf, transferAllToStorage } = require('./util_beheavor')


var roleSweeper = {

  /** @param {Creep} creep **/
  run: function (creep) {

    if (_.isUndefined(creep.memory.recycleCountdown)) {
      creep.memory.recycleCountdown = 50
    } else if (creep.memory.recycleCountdown == 0) {
      recycleSelf(creep)
    }


    let droppedResources = creep.room.find(FIND_DROPPED_RESOURCES)

    //start to work
    if (droppedResources.length) {

      if (creep.store.getFreeCapacity != 0) {

        let resourcePriorizer = targetsPriorizer_byRef('resourceType', RESOURCES_ALL.reverse())
        let priorizedResource = resourcePriorizer(droppedResources)

        if (creep.pickup(priorizedResource) == ERR_NOT_IN_RANGE) {
          creep.moveTo(priorizedResource)
        }

        //if 
      } else {
        transferAllToStorage(creep)
      }
      //after pickup

    }

    //if dont have work,start to countdown
    else {
      if (creep.memory.recycleCountdown > 0) {
        creep.memory.recycleCountdown -= 1
      }
    }
  }
};

module.exports = roleSweeper.run;