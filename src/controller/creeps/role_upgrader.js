import { getEnergyFromContainer, getEnergyFromStorage, getEnergyFromNearbyLink, getEnergyFromTerminal, getEnergyFromHarvest, moveAndWithdraw } from '@/utils/util_beheavor';
import { stayInRoomCallBack } from '@/utils/util_costCallBacks';



var roleUpgrader = {

  /** @param {Creep} creep **/
  run: function (creep) {

    //执行强化
    // let boost = false
    // if (boost && creep.ticksToLive > 1300) {
    //   let lab = Game.getObjectById('620a638d7a3c3562cf7103f6')
    //   let resourceType = RESOURCE_CATALYZED_GHODIUM_ACID
    //   let workParts = _.filter(creep.body, p => p.type === WORK)

    //   if (workParts.length > 0
    //     && creep.room === lab.room
    //     && workParts[0].boost === undefined
    //     && lab.store[resourceType] >= 30 * workParts.length) {
    //     let boostResult = lab.boostCreep(creep)
    //     if (boostResult == ERR_NOT_IN_RANGE) {
    //       creep.moveTo(lab, { reusePath: 50 })
    //     }
    //     return
    //   }
    // }

    if (creep.room.controller && creep.room.controller.my && creep.room.controller.level >= 8) {
      let CM = creep.memory//简写

      if (_.isUndefined(CM.upgrader_linkID)) {
        let links = creep.room.memory[STRUCTURE_LINK]
        for (let linkID in links) {
          let link = Game.getObjectById(linkID);
          if (link == undefined) {
            delete creep.room.memory[STRUCTURE_LINK][linkID]
          }

          if (links[linkID].type == "controller") {
            CM.upgrader_linkID = linkID
            break
          }

        }
        if (_.isUndefined(CM.upgrader_linkID)) {
          CM.upgrader_linkID = 'none'
        }
      }

      if (_.isUndefined(CM.workParts)) {
        CM.workParts = creep.getActiveBodyparts(WORK)
      }

      if (CM.upgrader_linkID == 'none') {
        return;
      }

      if (creep.store[RESOURCE_ENERGY] < CM.workParts) {
        let link = Game.getObjectById(CM.upgrader_linkID)
        moveAndWithdraw(creep, link, RESOURCE_ENERGY)
      }

      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, { reusePath: 50 })
      }

      return;
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
        creep.moveTo(creep.room.controller, { costCallback: stayInRoomCallBack, visualizePathStyle: { stroke: '#FFFF00' } });
      }
    }
    else {//dont have energy



      //* 依次从Link,Container,Storage里拿
      if (getEnergyFromNearbyLink(creep, { range: 4, minCap: 0 })
        || getEnergyFromContainer(creep, { range: 3, })
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
export default roleUpgrader.run;