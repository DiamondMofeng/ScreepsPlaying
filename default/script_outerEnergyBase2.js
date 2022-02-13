/*
param:baseRoom,targetRoom
思路:
TODO 暂时手动定义起终点旗子
首先制造一个pionner creep
if not 位于目标房间:仅修路
  if(creep.memory.path==undefined),直接 creep.pos.findPathTo，并把结果存到memory里
  对于每个path，创建road的建筑工地，但是继续往前走
if 位于目标房间，定位claimer、harvester、miner的工作位置:
  claimer:寻路通向contoleer，最后坐标为工作位置，同时放下Road
  harvester：寻路通向source，同上
  miner:暂时不

  then :在harvester工作位置放下containr

  pionner利用本房间内的source修建筑

  设定房间memory的underConstruction值为true,若建筑工地完成则改为false



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



//! /////////////    MAIN    ///////////////////////////////////


/**
 * 
 * @param {String} flagNameFrom 起点旗子。必须给定
 * @param {String} flagNameTo 目标房间？的旗子
 * @param {String} spawnName 
 */
function buildEnergyBase(flagNameFrom, flagNameTo, spawnName) {
  //处理flag
  let flagTo = Game.flags[flagNameTo]
  if (_.isUndefined(flagTo)) {
    console.log('!!!buildEnergyBase--flag', flagNameTo, 'is not defined!!!!')
  }
  if (_.isUndefined(flagTo.memory.type)) {
    flagTo.memory.type = energyBase
  }
  if (_.isUndefined(flagTo.memory.energyBase_state)) {
    flagTo.memory.energyBase_state = 'underConstruction'
  }
  if (_.isUndefined(flagTo.memory.energyBase_pionners)) {
    flagTo.memory.energyBase_pionners = []
  }

  //根据flag的状态进行建造
  if (flagTo.memory.energyBase_state == 'underConstruction') {



    //从spawnName指定的spawn生产pionner
    //先建一个过去铺路
    //没有就造一个
    if (flagTo.memory.energyBase_pionners.length == 0) {
      let role1 = 'pionner_leader'
      let spawn = Game.spawns[spawnName]
      let pionnerName = `${role1}-${Game.time}-${flagNameTo}`
      let spawnResult = spawn.spawnCreep([], pionnerName, { memory: { role: role1 } })
      if (spawnResult == OK) {
        //成功则记下pionnerName
        flagTo.memory.energyBase_pionners.push(pionnerName)
      }
      //return //? 

    }

    //若有pionner
    //! 正式开始开拓任务
    else {
      for (pionnerName of flagTo.memory.energyBase_pionners) {
        let pionner = Game.creeps[pionnerName]
        let PM = pionner.memory //快捷访问
        //* 初始化pionner不存在的的memory

        let toStart = 'pionner_toStart' //检测一开始是否到达了起点
        if (_.isUndefined(PM[toStart])) {
          PM[toStart] = false
        }

        let pathRoomName = 'pionner_currentRoom' //用于检测所存路径的房间
        if (_.isUndefined(PM[pathRoomName])) {
          PM[pathRoomName] = pionner.room
        }

        let lol = 'pionner_lol' //预留
        if (_.isUndefined(PM[pathRoomName])) {
          PM[pathRoomName] = false
        }

        //! 起始房间中发生的事情
        let flagFrom = Game.flags[flagNameFrom]


        //? 这段检查挪到前面？

        if (_.isUndefined(flagFrom)) {
          console.log('!!!!!!!!!!!!!!FlagFrom is not defined!!!!!!!!!!!!!')
          return
        }

        //* 先去靠近起点旗子

        //若已靠近，则设为true
        if (pionner.pos.isNearTo(flagFrom)) {
          PM[toStart] = true
        }
        //若未靠近过，则尝试靠近
        if (PM[toStart] == false) {
          pionner.moveTo(flagFrom)
        }

        //* 开始铺路

        if (PM[toStart] == true) {

          //若无路径记忆，或路径房间过期 
          //  则赋予路径记忆

          //* 注意！ 这个路径只通向出口
          if (_.isUndefined(PM[pPath])
            || PM[pathRoomName] != pionner.room.name) {
            PM[pPath] = pionner.pos.findPathTo(flagTo)
          }

          //* 进行铺路
          for (pos of PM[pPath]) {
            pionner.room.createConstructionSite(pos, STRUCTURE_ROAD)
          }

          //* 沿着路走
          pionner.moveByPath(PM[pPath])

        }







      }
    }


  }
  // else if (true) {

  //   }

  // if (flag.room.memory.)
}



module.exports = buildEnergyBase