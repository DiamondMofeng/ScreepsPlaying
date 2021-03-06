//when spawn, add memory of certain source position to go , and bind with this source.
//出生时绑定指定能量源，并指定工作坐标（待完成）
//工作时站在container上不动，采集的资源自动掉到container里面
//[WORK*5,MOVE] COST:550


//memory:
//{
//workPos:
//sourceId:
//}
var roleLongHarvester = {

  /**
   * 
   * @param {Creep} creep 
   * @param {StructureContainer} container 
   * @param {Source} source 
   */
  run: function (creep, containerID, sourceID) {

    let container = Game.getObjectById(containerID)
    let source = Game.getObjectById(sourceID)

    //move to container's pos
    if (JSON.stringify(creep.pos) != JSON.stringify(container.pos)) {
      // console.log(creep.pos, container.pos, creep.pos == container.pos)

      const moveResult = creep.moveTo(container.pos, { visualizePathStyle: { stroke: '#ffaa00' } })
    }

    //after arrive at workPos
    //start to harvest
    else {
      // console.log('debug')
      if (creep.store.getUsedCapacity() < 40) {
        const harvestResult = creep.harvest(source)
        // console.log('harvestResult', harvestResult)

      } else {
        //修container
        // console.log('container\'s hits:',container.hits / container.hitsMax)
        if ((container.store.getUsedCapacity() > 1800 && (container.hits / container.hitsMax) < 1)
          || (container.hits / container.hitsMax) < 0.8) {
          creep.repair(container)
        }
        //不用修则向container输入能量
        else {
          creep.transfer(container, RESOURCE_ENERGY)
        }
      }
    }




  }
}

module.exports = roleLongHarvester.run;


