const { pickUpNearbyDroppedEnergy } = require("./util_beheavor")
const { startWith } = require("./util_helper")

//when spawn, add memory of certain source position to go , and bind with this source.
//出生时绑定指定能量源，并指定工作坐标（待完成）
// //工作时站在container上不动，采集的资源自动掉到container里面
//现在具有CARRY部件。
//能量满后(>40)，先检测是否需要维修，
//若否：
//  若旁边（1格内）具有link，则把能量放入LINK中。
//    else 放入container中
//
//[WORK*5,MOVE] COST:550

//memory:
//{
//workPos:
//sourceId:
//}

//临时

// if (!creep.memory.harvester_sourceID) {
//   let sources = creep.room.find(FIND_SOURCES);

//   for (s of sources) {
//     if (s.pos.findInRange(FIND_CREEPS, 1, { filter: c => startWith(c.memory.role, 'harvester') }).length === 0) {
//       creep.memory.harvester_sourceID = s.id
//       let container = s.pos.findInRange(FIND_STRUCTURES, 1, { filter: s => s.structureType === STRUCTURE_CONTAINER })[0]
//       if (container) {
//         creep.memory.harvester_workPos = { x: container.pos.x, y: container.pos.y, roomName: container.pos.roomName }
//       }
//       break
//     }
//   }
// }



var roleHarvesterPlus = {


  /** @param {Creep} creep **/
  run: function (creep) {

    let CM = creep.memory//简写
    //if going to die
    // if (creep.ticksToLive < 50) {
    //   //clean memory
    //   creep.room.memory.sources[CM.harvester_sourceID].onHarvest = false
    // }


    //after spawn
    //尝试寻找一个有空位的source
    if (_.isUndefined(CM.harvester_sourceID)) {


      //* 如果一格内有source，则视为找到了
      let nearSources = creep.pos.findInRange(FIND_SOURCES, 1)
      if (nearSources.length > 0) {


        let nearContainers = creep.pos.findInRange(FIND_STRUCTURES, 1, { filter: s => s.structureType == STRUCTURE_CONTAINER })
        if (nearSources.length > 0 && nearContainers.length == 0) {
          CM.harvester_sourceID = nearSources[0].id
        }
        else if (nearSources.length > 0 && nearContainers.length > 0) {
          for (container of nearContainers) {
            if (container.pos.isEqualTo(creep.pos)) {
              // console.log('creep.pos: ', creep.pos);
              // console.log('container.pos: ', container.pos);
              // console.log('container: ', container);

              CM.harvester_sourceID = nearSources[0].id
            } else {
              if (creep.moveTo(container, { noPathFinding: true }) == ERR_NOT_FOUND) {
                creep.moveTo(container)
              }
            }
          }
        }
      }




      //* 尝试寻找
      let sources = creep.room.find(FIND_SOURCES);

      for (s of sources) {
        //先找container,如果有container那么这个source只需要一个harvester
        //;若无container，则没有数量限制。
        let container = s.pos.findInRange(FIND_STRUCTURES, 1, { filter: s => s.structureType === STRUCTURE_CONTAINER })[0]
        if (container) {
          let currentHarvesters = s.pos.findInRange(FIND_CREEPS, 1, { filter: c => startWith(c.memory.role, 'harvester') })
          if (currentHarvesters.length > 0) {
            continue
          } else {
            creep.moveTo(container, { reusePath: 50 })
          }
        }
        else {
          let moveResult = creep.moveTo(s, { reusePath: 10 })
          if (moveResult === ERR_NO_PATH) {
            continue
          }
        }
      }


      //? 都没找到咋处理？ 作废？-> useless?

    }

    //* after arrive at workPos

    //* save nearBy struct into memory

    // save link



    //* start to harvest

    else {

      // console.log(`test`);
      if (_.isUndefined(CM.harvester_linkID)) {
        let links = creep.pos.findInRange(FIND_STRUCTURES, 1, { filter: s => s.structureType == STRUCTURE_LINK })
        if (links.length > 0) {
          CM.harvester_linkID = links[0].id
        }
        else {
          CM.harvester_linkID = 'none'
        }
      }

      // save container
      if (_.isUndefined(CM.harvester_containerID)) {
        let containers = creep.pos.findInRange(FIND_STRUCTURES, 1, { filter: s => s.structureType == STRUCTURE_CONTAINER })
        if (containers.length > 0) {
          CM.harvester_containerID = containers[0].id
        }
        else {
          CM.harvester_containerID = 'none'
        }
      }

      // save source
      if (_.isUndefined(CM.harvester_sourceID)) {
        let sources = creep.pos.findInRange(FIND_SOURCES, 1)
        if (sources.length > 0) {
          CM.harvester_sourceID = sources[0].id
        }
        else {
          CM.harvester_sourceID = 'none'
        }
      }

      if (_.isUndefined(CM.harvester_extensionIDs)) {
        let extensions = creep.pos.findInRange(FIND_STRUCTURES, 1, { filter: s => s.structureType == STRUCTURE_EXTENSION })
        if (extensions.length > 0) {
          CM.harvester_extensionIDs = extensions.map(e => e.id)
        }
        else {
          CM.harvester_extensionIDs = []
        }
      }

      //! WORK


      const harvestResult = creep.harvest(Game.getObjectById(CM.harvester_sourceID))
      // console.log('harvestResult', harvestResult)

      pickUpNearbyDroppedEnergy(creep, 1)

      //* 尝试向extension中注入能量
      if (CM.harvester_extensionIDs.length > 0) {
        for (eID of CM.harvester_extensionIDs) {
          let e = Game.getObjectById(eID)
          if (e.store.getFreeCapacity(RESOURCE_ENERGY) !== 0) {
            // console.log('e.store.getFreeCapacity(): ', e.store.getFreeCapacity());
            // console.log('e.store: ', e.store);
            // console.log('e: ', e);
            creep.transfer(e, RESOURCE_ENERGY)
            // console.log('creep.transfer(e, RESOURCE_ENERGY): ', creep.transfer(e, RESOURCE_ENERGY));
            return  //! RETURN
          }
        }
      }


      //* 修container

      let container = Game.getObjectById(CM.harvester_containerID)
      // console.log('container: ', container);
      if (container && ((container.store.getUsedCapacity() > 1000 && (container.hits / container.hitsMax) < 0.9)
        || (container.hits / container.hitsMax) < 0.7)) {

        creep.repair(container)
      }
      //* 不用修则尝试向Link输入能量
      else if (CM.harvester_linkID != 'none' && Game.getObjectById(CM.harvester_linkID).store.getFreeCapacity() != 0) {

        creep.transfer(Game.getObjectById(CM.harvester_linkID), RESOURCE_ENERGY)
      }

      //* 否则向container中输入能量
      else if (CM.harvester_containerID != 'none' && Game.getObjectById(CM.harvester_containerID).store.getFreeCapacity() != 0) {

        creep.transfer(Game.getObjectById(CM.harvester_containerID), RESOURCE_ENERGY)
      }

      //* 否则把能量扔地上

      else {
        creep.drop(RESOURCE_ENERGY)
      }

    }


    // }


    // creep.transfer(container, RESOURCE_ENERGY)

    //* 








  }
}

module.exports = roleHarvesterPlus.run;


