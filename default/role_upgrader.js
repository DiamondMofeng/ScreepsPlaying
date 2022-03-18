const { getEnergyFromContainer, getEnergyFromStorage, getEnergyFromNearbyLink, getEnergyFromTerminal, getEnergyFromHarvest } = require('./util_beheavor')



var roleUpgrader = {

  /** @param {Creep} creep **/
  run: function (creep) {

    //执行强化
    let boost = false
    if (boost && creep.ticksToLive > 1300) {
      let lab = Game.getObjectById('620a638d7a3c3562cf7103f6')
      let resourceType = RESOURCE_CATALYZED_GHODIUM_ACID
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



      //* 依次从Link,Container,Storage里拿
      if (getEnergyFromNearbyLink(creep, { range: 3, minCap: 0 })
        || getEnergyFromContainer(creep, { range: 2, BL: ['61feb366182cf40dfd2b848a', '61ff6d41e69b53cf867c9aac', '621511cd317fb0f68a6e076a', '6214a646de5fb11b25de0545'] })
        || getEnergyFromTerminal(creep)
        || getEnergyFromStorage(creep)


        || getEnergyFromHarvest(creep)
      ) {

      }

      else {
        console.log(`upgrader ${creep} can not find energy`)
        // var sources = creep.room.find(FIND_SOURCES_ACTIVE);

        // if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        //   creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
        // }
      }
    }
  }
}
module.exports = roleUpgrader.run;