/*
param:baseRoom,targetRoom
思路:用pos.findPathTo从storage寻找通向room内资源点的路径:

room.storage.pos.findPathTo





*/

let costMatrix = new PathFinder.CostMatrix()

let findOpt = {
  ignoreCreeps: true,

}



/**
 * 
 * @param {RoomPosition} fromPos 
 * @param {RoomPosition} toPos 
 */
function pathFinder(fromPos, toPos) {

  let goals = { pos: toPos.pos, range: 1 };
  ;

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

roomList









function buildEnergyBase(room) {
}


