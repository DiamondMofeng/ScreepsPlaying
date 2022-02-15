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


*已知问题
TODO 未考虑建筑工地被踩坏的影响
TODO 给claimer留空位


*/




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


  //根据flag的状态进行建造
  //! 状态1：等待部署
  if (flagTo.memory[energyBase_state] == state_waitForDeposit) {
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
            let moveResult = pionner.moveByPath(PM[pPath])
            if (moveResult = ERR_NOT_FOUND) {
              PM[pPath] = pionner.pos.findPathTo(flagTo, opt)
            }
            console.log(' pionner.moveByPath(PM[pPath]): ', pionner.moveByPath(PM[pPath]));

          }

          //! 若已到达目标房间

          else {
            //为防止来回exit，先往前走一步
            //* 因为这一步，等会铺路的时候要往脚下铺一格
            let oneStep = 'oneStep'
            if (_.isUndefined(flagTo.memory[oneStep])) {
              flagTo.memory[oneStep] = false
            }
            if (flagTo.memory[oneStep] == false) {
              if (pionner.move(pionner.pos.getDirectionTo(25, 25)) == 0) {
                flagTo.memory[oneStep] = true

              }
            }


            //开始准备铺路
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

              pionner.room.createConstructionSite(pionner.pos, STRUCTURE_ROAD)  //! 因为之前往房间里面走了一格
              for (let pos of path_toController) {
                pionner.room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD)
              }

              //记录claimer工作位置，方便后续绕道
              let lastPos = path_toController[path_toController.length - 1]
              let workPos_claimer = { x: lastPos.x, y: lastPos.y, roomName: pionner.room.name } //? 待更改roomName的获取方式

              if (_.isUndefined(pionner.room.memory.energyBase)) {
                pionner.room.memory.energyBase = {}
              }
              pionner.room.memory.energyBase.workPos_claimer = workPos_claimer

              //* tick++
              flagTo.memory[tick] += 1
              return
            }

            //! tick2: sourceS
            if (flagTo.memory[tick] == 2) {
              let sources = pionner.room.find(FIND_SOURCES)
              console.log('sources: ', sources);
              let paths_toSoure = []
              //* ///////////////// 定义躲避claimer工作位置的opt/////////////////
              let opt_avoidClaimer = {
                ...opt, costCallback: function (roomName) {

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
                  //*设置指定位置的cost为最大
                  let workPos_claimer = pionner.room.memory.energyBase.workPos_claimer
                  costs.set(workPos_claimer.x, workPos_claimer.y, 0xff)

                  return costs;
                },
              }
              //* //////////// opt定义结束///////////////////

              for (s of sources) {
                console.log('s: ', s);
                paths_toSoure.push(pionner.pos.findPathTo(s, opt_avoidClaimer))
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


              //? 这块代码太乱了，有时间重构一下
              //放container
              let toSaveInMemory = []
              for (pos of posArrayForContainer) {
                pionner.room.createConstructionSite(pos.x, pos.y, STRUCTURE_CONTAINER)

                //顺便把container位置存到room.memory.energyBase里
                if (_.isUndefined(room.memory.energyBase.workPosArray_harvester)) {
                  room.memory.energyBase.workPosArray_harvester = []
                }
                toSaveInMemory.push({ x: pos.x, y: pos.y, roomName: pionner.room.name })
              }

              if (_.isUndefined(room.memory.energyBase.workPosArray_harvester)) {
                room.memory.energyBase.workPosArray_harvester = []
              }
              room.memory.energyBase.workPosArray_harvester = toSaveInMemory

              //* tick++
              flagTo.memory[tick] += 1
              return
            }

            //! tick3: mine
            if (flagTo.memory[tick] == 3) {
              let mine = pionner.room.find(FIND_MINERALS)[0]//? is there only 1 mine each room?

              //* ///////////////// 定义躲避claimer和Harvester工作位置的opt/////////////////
              let opt_avoidClaimerAndHarvester = {
                ...opt, costCallback: function (roomName) {

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
                  //*设置指定位置的cost为最大
                  let workPos_claimer = pionner.room.memory.energyBase.workPos_claimer
                  costs.set(workPos_claimer.x, workPos_claimer.y, 0xff)

                  let workPosArray_harvester = pionner.room.memory.energyBase.workPosArray_harvester
                  for (pos in workPosArray_harvester) {
                    costs.set(pos.x, pos.y, 0xff)
                  }

                  return costs;
                }
              }
              //* //////////// opt定义结束///////////////////

              let path_toMine = pionner.pos.findPathTo(mine, opt_avoidClaimerAndHarvester)
              //铺路
              for (let pos of path_toMine) {
                pionner.room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD)
                console.log('pionner.room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD): ', pionner.room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD));
              }
              //放extractor
              pionner.room.createConstructionSite(pos.x, pos.y, STRUCTURE_EXTRACTOR)
              flagTo.memory[tick] += 1 //?
              return
            }

            //* forDEBUG
            if (flagTo.memory[tick] == 4) {
              let CTs = pionner.room.find(FIND_CONSTRUCTION_SITES)
              for (let ct of CTs) {
                ct.remove()
              }
              flagTo.memory[tick] = 1
              flagTo.memory[energyBase_state] = state_waitForBuilding
            }

            //! 工地设置完成后设置为 状态2：待建状态


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