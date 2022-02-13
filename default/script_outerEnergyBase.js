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

  let energyBase_state = 'energyBase_state'
  let energyBase_pionners = 'energyBase_pionners'

  let state_waitForDeposit = 'waitForDeposit'
  let state_waitForBuilding = 'waitForBuilding'
  let state_done = 'done'

  if (_.isUndefined(flagTo)) {
    console.log('!!!buildEnergyBase--flag', flagNameTo, 'is not defined!!!!')
  }
  if (_.isUndefined(flagTo.memory.type)) {
    flagTo.memory.type = 'energyBase'
  }
  if (_.isUndefined(flagTo.memory[energyBase_state])) {
    flagTo.memory[energyBase_state] = state_waitForDeposit
  }
  if (_.isUndefined(flagTo.memory[energyBase_pionners])) {
    flagTo.memory[energyBase_pionners] = []
  }

  //* 传入寻路的opt
  let opt = {
    ignoreCreeps: true,
    range: 1,
    serialize: false,
    plainCost: 2,
    swampCost: 5,
    costCallback: function (roomName) {

      let room = Game.rooms[roomName];
      if (_.isUndefined(room)) return;

      let costs = new PathFinder.CostMatrix;

      //设置道路工地的cost为1
      room.find(FIND_CONSTRUCTION_SITES).forEach(s => {
        if (s.structureType == STRUCTURE_ROAD) {
          costs.set(s.pos.x, s.pos.y, 1)
        }
      })
      //设置道路cost为1，不可通行的建筑cost为最大
      room.find(FIND_STRUCTURES).forEach(function (s) {
        if (s.structureType === STRUCTURE_ROAD) {
          costs.set(s.pos.x, s.pos.y, 1);
        }
        else if (s.structureType !== STRUCTURE_CONTAINER
          && (s.structureType !== STRUCTURE_RAMPART ||
            !s.my)
        ) {
          costs.set(s.pos.x, s.pos.y, 0xff);
        }
      });

      return costs;
    },
  }
  //根据flag的状态进行建造
  //! 状态1：等待部署
  if (flagTo.memory[energyBase_state] == state_waitForDeposit) {



    //从spawnName指定的spawn生产pionner
    //先建一个过去铺路


    //清除死去的pionner creep
    //? 不知道有没有bug,这个for splice
    for (creepName of flagTo.memory[energyBase_pionners]) {
      if (Object.keys(Game.creeps).indexOf(creepName) == -1) {
        let indexToDelete = flagTo.memory[energyBase_pionners].indexOf(creepName)
        flagTo.memory[energyBase_pionners].splice(indexToDelete, 1)
      }
    }

    //没有就造一个
    if (flagTo.memory[energyBase_pionners].length == 0) {
      let role1 = 'pionner_leader'
      let spawn = Game.spawns[spawnName]
      let pionnerName = `${role1}-${Game.time}-${flagNameTo}`
      let spawnResult = spawn.spawnCreep([WORK, CARRY, MOVE], pionnerName, { memory: { role: role1 } })
      if (spawnResult == OK) {
        //成功则记下pionnerName
        flagTo.memory[energyBase_pionners].push(pionnerName)
      }
      return //? 

    }

    //若有pionner

    //! 正式开始开拓任务

    else {
      for (pionnerName of flagTo.memory[energyBase_pionners]) {
        let pionner = Game.creeps[pionnerName]
        let PM = Memory.creeps[pionnerName] //快捷访问
        // console.log('PM: ', JSON.stringify(PM));
        // console.log('PM: ', JSON.stringify(pionner.memory));
        //* 初始化pionner不存在的的memory

        let toStart = 'pionner_toStart' //检测一开始是否到达了起点
        if (_.isUndefined(PM[toStart])) {
          PM[toStart] = false
        }

        let pathRoomName = 'pionner_currentRoom' //用于检测所存路径的房间
        if (_.isUndefined(PM[pathRoomName])) {
          PM[pathRoomName] = pionner.room.name
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

        //! 状态1：等待部署
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


          //! 若未到达目标房间：
          //先仅铺路
          if (pionner.room != flagTo.room) {



            //若无路径记忆，或路径房间过期 
            //  则赋予路径记忆

            //* 注意！ 这个路径只通向出口
            let pPath = 'pionner_path'
            if (_.isUndefined(PM[pPath])
              || PM[pathRoomName] != pionner.room.name) {
              PM[pPath] = pionner.pos.findPathTo(flagTo, opt)
            }

            //* 进行铺路
            for (pos of PM[pPath]) {
              pionner.room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD)
              // console.log('pionner.room.createConstructionSite(pos, STRUCTURE_ROAD): ', pionner.room.createConstructionSite(pos, STRUCTURE_ROAD));
            }

            //* 沿着路走
            pionner.moveByPath(PM[pPath])

          }

          //! 若已到达目标房间

          else {

            //! 分tick进行，方便重复利用道路
            //初始化tick为1
            let tick = 'tick'
            if (_.isUndefined(flagTo.memory[tick])) {
              flagTo.memory[tick] = 1
            }

            //! tick1: controller
            if (flagTo.memory[tick] == 1) {
              //获取信息
              let controller = pionner.room.controller;
              let path_toController = pionner.pos.findPathTo(controller, opt);
              //铺路
              for (let pos of path_toController) {
                pionner.room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD)
              }

              //* tick++
              flagTo.memory[tick] += 1
              return
            }

            //! tick2: sourceS
            if (flagTo.memory[tick] == 2) {
              let sources = pionner.room.find(FIND_SOURCES)
              let paths_toSoure = []
              for (s in sources) {
                paths_toSoure.push(pionner.pos.findPathTo(s, opt))
              }
              //铺路
              //顺便把container位置存到数组里
              let posArrayForContainer = []

              for (let path of paths_toSoure) {
                for (let posIndex in path) {
                  let pos = path[posIndex]
                  if (posIndex == path.length - 1) {
                    posArrayForContainer.push(pos)
                  } else {
                    pionner.room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD)
                  }
                }
              }

              //放container
              for (pos of posArrayForContainer) {
                pionner.room.createConstructionSite(pos.x, pos.y, STRUCTURE_CONTAINER)
              }

              //* tick++
              flagTo.memory[tick] += 1
              return
            }

            //! tick3: mine
            if (flagTo.memory[tick] == 3) {
              let mine = pionner.room.find(FIND_MINERALS)[0]//? is there only 1 mine each room?
              let path_toMine = pionner.pos.findPathTo(mine)
              //铺路
              for (let pos of path_toMine) {
                pionner.room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD)
              }
              //放extractor
              pionner.room.createConstructionSite(pos.x, pos.y, STRUCTURE_EXTRACTOR)
              // flagTo.memory[tick] += 1 //?
            }
            //* 工地设置完成后设置为 状态2：待建状态
            flagTo.memory[energyBase_state] = state_waitForBuilding

          }




        }
      }

    }
  }
  //! 状态阶段2： 等待建设
  if (flagTo.memory[energyBase_state] == state_waitForBuilding) {

  }
}





module.exports = buildEnergyBase