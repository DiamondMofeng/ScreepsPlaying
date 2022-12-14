const { memoryResources, memoryUpgradePosArray } = require('./util_getMemories')

function transferEnergyToContainer(creep) {

  console.time('t1')
  let containers = creep.room.find(FIND_STRUCTURES, { filter: s.structureType == StructureContainer })
  creep.pos.findClosestByPath(containers, { filter: s.structureType == StructureContainer })
  console.timeEnd('t1')
}

function transferEnergyToContainer2(creep) {
  console.time('t2')
  creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: s.structureType == StructureContainer })
  console.timeEnd('t2')
}




function outMineFinder() {
  let from = new RoomPosition(24, 35, 'W12N16');
  let to = new RoomPosition(20, 31, 'W12N17');

  // 使用`findRoute`计算路径的高阶计划，优先选择大路和自有房间
  let allowedRooms = { [from.roomName]: true };
  Game.map.findRoute(from.roomName, to.roomName, {
    routeCallback(roomName) {
      let parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName);
      let isHighway = (parsed[1] % 10 === 0) ||
        (parsed[2] % 10 === 0);
      let isMyRoom = Game.rooms[roomName] &&
        Game.rooms[roomName].controller &&
        Game.rooms[roomName].controller.my;
      if (isHighway || isMyRoom) {
        return 1;
      } else {
        return 2.5;
      }
    }
  }).forEach(function (info) {  //example: { exit: FIND_EXIT_RIGHT, room: 'arena21' }

    allowedRooms[info.room] = true;
  });

  // 调用PathFinder, 只允许访问`findRoute`中的房间
  let ret = PathFinder.search(from, to, {
    roomCallback(roomName) {
      //筛除room
      if (allowedRooms[roomName] === undefined) {
        return false;
      }
      else{

      }
    }
  });

  // console.log(ret.path);

  return ret
}

function showFIndReslt() {
  let RV = new RoomVisual

  let result = outMineFinder().path
  // console.log('result: ', JSON.stringify(result));

  RV.poly(result, {
    stroke: '#EC407A'
  })

}



let test = {
  memoryUpgradePosArray: memoryUpgradePosArray,

  trans1: transferEnergyToContainer,

  trans2: transferEnergyToContainer2,

  findTest: outMineFinder,

  showFIndReslt: showFIndReslt,

}



module.exports = test