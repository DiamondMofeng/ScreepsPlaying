const { getEnergyFromContainer, getEnergyFromStorage, getEnergyFromNearbyLink } = require('./util_beheavor')



var roleUpgrader = {

  /** @param {Creep} creep **/
  run: function (creep) {

    //执行强化
    let boost = true
    if (boost) {
      let lab = Game.getObjectById('620b72e917753b7eff964959')
      let resourceType = RESOURCE_GHODIUM_HYDRIDE
      let workParts = _.filter(creep.body, p => p.type === WORK)

      if (workParts.length > 0
        && creep.room === lab.room
        && workParts[0].boost === undefined
        && lab.store[resourceType] >= 30 * workParts.length) {
        let boostResult = lab.boostCreep(creep)
        if (boostResult == ERR_NOT_IN_RANGE) {
          creep.moveTo(lab, { reusePath: 50 })
        }
        return
      }
    }





    if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.upgrading = false;
      creep.say('🔄 harvest');
    }
    if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
      creep.memory.upgrading = true;
      creep.say('⚡ upgrade');
    }

    if (creep.memory.upgrading) {
      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#FFFF00' } });
      }
    }
    else {//dont have energy



      //* 依次从Container,Link,Storage里拿
      if (getEnergyFromContainer(creep, { BL: ['61feb366182cf40dfd2b848a', '61ff6d41e69b53cf867c9aac'] })
        || getEnergyFromNearbyLink(creep, { range: 2, minCap: 0 })
        || getEnergyFromStorage(creep)) {

      }

      else {
        // var sources = creep.room.find(FIND_SOURCES_ACTIVE);

        // if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        //   creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
        // }
      }
    }
  }
}
module.exports = roleUpgrader.run;