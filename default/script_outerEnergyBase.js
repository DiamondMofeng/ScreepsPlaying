/*
param:baseRoom,targetRoom
思路:
TODO 暂时手动定义起终点
首先用`Game.map.findRoute`寻找路径房间，把结果存到memory.outerBase中
再用PathFinder.search初步寻找路径，把每个房间的第一个/最后一个点记录，用于后续优化路径
对于结果房间，从起点房间开始依次处理。
  首先，检查正在处理的房间是否有视野(在rooms中)
  若无视野，则：
    observer开视野；派creep去开视野
  有视野后，
    用`PathFinder.search`找路，方便利用现有道路、规避建筑等，
    ? 同时一定程度上降低沼泽的权重方便修近路 ?
    * 1.controller
    找路前，挑选一个点 距离controller为1内的 距离入口最近的点作为后续cliamer的工作位置
    第一遍找路通向controller，调整cliamer的工作位置cost为256，放置一条通向controller的 道路 的 建筑工地，
    
    * 2.现在开始处理sources
    对于source,获取后存入数组，依次处理。
    寻路前，放置一个container,位置为 (?实现) 距离source为1内的离入口最近的点
    进行 第 2 - ? 遍寻路 找路通向source。此时调整 Road建筑工地 的cost等同道路，container建筑工地 的cost为最大。找到后放置道路 的 建筑工地

    * 3.记录路径
    最后记录路径供后续工作bot行动。
    claimer: path_toController
    harvester: path_toSource 1、2
    carrier: path_toSource 、 (? path_fromSource(toStorage))
    ? 大概没必要单独存一个反向的

! 派遣pionner去修建筑

    
    
  
    // 起点：
    // 终点：

room.storage.pos.findPathTo


*/

// let costMatrix = new PathFinder.CostMatrix()


let testMartix = function (roomName) {

  let room = Game.rooms[roomName];
  // 在这个示例中，`room` 始终存在
  // 但是由于 PathFinder 支持跨多房间检索
  // 所以你要更加小心！
  if (!room) return;

  let costs = new PathFinder.CostMatrix;

  room.find(FIND_STRUCTURES).forEach(function (struct) {
    if (struct.structureType === STRUCTURE_ROAD) {
      // 相对于平原，寻路时将更倾向于道路
      costs.set(struct.pos.x, struct.pos.y, 1);
    } else if (struct.structureType !== STRUCTURE_CONTAINER &&
      (struct.structureType !== STRUCTURE_RAMPART ||
        !struct.my)) {
      // 不能穿过无法行走的建筑
      costs.set(struct.pos.x, struct.pos.y, 0xff);
    }
  });

  // //躲避房间中的 creep
  // room.find(FIND_CREEPS).forEach(function (creep) {
  //   costs.set(creep.pos.x, creep.pos.y, 0xff);
  // });

  return costs;
}





/**
 * 
 * @param {RoomPosition} fromPos 
 * @param {RoomPosition} toPos 
 */
function pathFinder(fromPos, toPos) {

  let goals = { pos: toPos.pos, range: 1 };

  let ret = PathFinder.search(
    fromPos, goals,
    {
      // 我们需要把默认的移动成本设置的更高一点
      // 这样我们就可以在 roomCallback 里把道路移动成本设置的更低
      plainCost: 2,
      swampCost: 4,

      roomCallback: function (roomName) {

        let room = Game.rooms[roomName];
        // 在这个示例中，`room` 始终存在
        // 但是由于 PathFinder 支持跨多房间检索
        // 所以你要更加小心！
        if (!room) return;

        let costs = new PathFinder.CostMatrix;

        room.find(FIND_STRUCTURES).forEach(function (struct) {
          if (struct.structureType === STRUCTURE_ROAD) {
            // 相对于平原，寻路时将更倾向于道路
            costs.set(struct.pos.x, struct.pos.y, 1);
          } else if (struct.structureType !== STRUCTURE_CONTAINER &&
            (struct.structureType !== STRUCTURE_RAMPART ||
              !struct.my)) {
            // 不能穿过无法行走的建筑
            costs.set(struct.pos.x, struct.pos.y, 0xff);
          }
        });

        // //躲避房间中的 creep
        // room.find(FIND_CREEPS).forEach(function (creep) {
        //   costs.set(creep.pos.x, creep.pos.y, 0xff);
        // });

        return costs;
      },
    }
  );

  let pos = ret.path[0];
  creep.move(creep.pos.getDirectionTo(pos));

}

// ? roomList







function buildEnergyBase(roomToBuild = '') {

  let resule = pathFinder(Game.flags['findStarter'].pos, Game.flags['findEnder'].pos)

  console.log('resule: ', JSON.stringify(resule));

  // let ret = testMartix('W11N16')
  // console.log('ret: ', ret.serialize());

}


module.exports = buildEnergyBase