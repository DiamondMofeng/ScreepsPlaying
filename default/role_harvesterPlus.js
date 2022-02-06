/*
**
*/
//when spawn, add memory of certain source position to go , and bind with this source.
//出生时绑定指定能量源，并指定工作坐标（待完成）
//工作时站在container上不动，采集的资源自动掉到container里面
//[WORK*5,MOVE] COST:550

//memory:
//{
//workPos:
//sourceId:
//}
var roleHarvesterPlus = {
  /** @param {Creep} creep **/
  run: function (creep) {

    //after spawn
    //move to workPos
    if (!(
      (creep.pos.x == creep.memory.workPos.x) && (creep.pos.y == creep.memory.workPos.y)
    )) {
      // console.log(creep.memory.workPos)
      const moveResult = creep.moveTo(creep.memory.workPos.x, creep.memory.workPos.y
        , { visualizePathStyle: { stroke: '#ffaa00' } })
    }

    //after arrive at workPos
    //start to harvest
    else {
      const harvestResult = creep.harvest(Game.getObjectById(creep.memory.sourceId))
      // console.log('harvestResult', harvestResult)
    }



    //if going to die
    if (creep.ticksToLive < 50) {
      //clean memory
      creep.room.memory.sources[creep.memory.index].onHarvest = false
    }

  }
}

module.exports = roleHarvesterPlus.run;


