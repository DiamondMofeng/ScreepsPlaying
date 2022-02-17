
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
var roleHarvesterPlus = {
  /** @param {Creep} creep **/
  run: function (creep) {

    let CM = creep.memory//简写


    //after spawn
    //move to workPos
    if (!(
      (creep.pos.x == creep.memory.workPos.x)
      && (creep.pos.y == creep.memory.workPos.y)
    )) {
      // console.log(creep.memory.workPos)
      const moveResult = creep.moveTo(creep.memory.workPos.x, creep.memory.workPos.y
        , { visualizePathStyle: { stroke: '#ffaa00' } })
    }

    //* after arrive at workPos

    //* save nearBy struct into memory

    // save link



    //* start to harvest

    else {
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


      //! WORK
      const harvestResult = creep.harvest(Game.getObjectById(CM.harvester_sourceID))
      // console.log('harvestResult', harvestResult)


      //* 修container
      let container = Game.getObjectById(CM.harvester_containerID)
      if ((container.store.getUsedCapacity() > 1000 && (container.hits / container.hitsMax) < 0.9)
        || (container.hits / container.hitsMax) < 0.7) {
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






    //if going to die
    if (creep.ticksToLive < 5) {
      //clean memory
      creep.room.memory.sources[creep.memory.sourceId].onHarvest = false
    }

  }
}

module.exports = roleHarvesterPlus.run;


