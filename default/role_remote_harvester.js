//when spawn, add memory of certain source position to go , and bind with this source.
//出生时绑定指定能量源，并指定工作坐标（待完成）
//工作时站在container上不动，采集的资源自动掉到container里面
//[WORK*5,MOVE] COST:550


//memory:
//{
//workPos:
//sourceId:
//}
var role_remote_harvester = {

  /**
   * 
   * @param {Creep} creep 
   * 
   */
  run: function (creep) {

    let CM = creep.memory

    let workRoom = CM.workRoom
    let RM = Memory.rooms[workRoom]
    //找到未使用的自己用，并标记为已使用
    let remote_harvester_container = 'remote_harvester_container'
    if (_.isUndefined(CM[remote_harvester_container])) {
      let containers = _.filter(RM.energyBase_containers, c => c.used !== true)
      CM[remote_harvester_container] = containers[0]
      containers[0].used = true
    }

    let remote_harvester_source = 'remote_harvester_source'
    if (_.isUndefined(CM[remote_harvester_source])) {
      let sources = _.filter(RM.energyBase_sources, s => s.used !== true)
      CM[remote_harvester_source] = sources[0]

      sources[0].used = true
      // console.log('CM[remote_harvester_source] === sources[0]: ', CM[remote_harvester_source] === sources[0]);
    }

    // 要老死的时候还回去
    //TODO 待优化
    if (creep.ticksToLive < 50) {
      let sourceToReturn = RM.energyBase_sources.filter(s => s.id === CM[remote_harvester_source].id)[0]
      let containerToReturn = RM.energyBase_containers.filter(s => s.id === CM[remote_harvester_container].id)[0]

      sourceToReturn.used=false
      containerToReturn.used=false
    }

    let containerID = CM[remote_harvester_container].id
    let sourceID = CM[remote_harvester_source].id


    let container = Game.getObjectById(containerID)
    let source = Game.getObjectById(sourceID)


    //* MAIN////

    //move to container's pos
    if (JSON.stringify(creep.pos) != JSON.stringify(container.pos)) {
      // console.log(creep.pos, container.pos, creep.pos == container.pos)

      const moveResult = creep.moveTo(container.pos, { reusePath: 50, visualizePathStyle: { stroke: '#ffaa00' } })
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

module.exports = role_remote_harvester.run;


