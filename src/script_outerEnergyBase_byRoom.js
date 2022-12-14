// const Builder = require('./role_builder')
const { setDoing } = require('./util_beheavor')
const { body, spawnByMinNumber, bodyCost } = require('./util_helper')
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
划掉的是已完成
TODO 未考虑建筑工地被踩坏的影响
TODO 未考虑建筑工地达到上线后如何处理
TODO 没有占领的房间放不了extractor，把那行代码删掉，整个对于Mineral的处理也删掉。。这以后将属于主基地的逻辑。
TODO 给builder添加采多矿的逻辑。现在只采一个。可以改为：根据source分配builder，并且先修最近的建筑工地
// TODO 给claimer留空位

* 后来发现的问题：
TODO 未考虑invaderCore入侵时 要清除核心
TODO 尽快解决container被摧毁时如何自动恢复



*/




// ? roomList



//! /////////////    MAIN    ///////////////////////////////////

/**
 * 
 * @param {string} spawnName - 此基地的creep由此spawn负责
 * @param {string} roomNameTo - 要去开辟能源基地的房间
 * @param {RoomPosition} startPos - 若指定，则修路起始点改为此处（默认为storage）
 * @returns 
 */
function buildEnergyBase(spawnName, roomNameTo = 'W12N17', startPos = null) {


  if (_.isUndefined(Memory.rooms[roomNameTo])) {
    Memory.rooms[roomNameTo] = {}
  }
  let RM = Memory.rooms[roomNameTo]


  let energyBase_state = 'energyBase_state'
  let energyBase_pionners = 'energyBase_pionners'

  let energyBase_sources = 'energyBase_sources'

  let state_waitForDeposit = 'waitForDeposit'
  let state_waitForBuilding = 'waitForBuilding'
  let state_done = 'done'


  if (_.isUndefined(RM.type)) {
    RM.type = 'energyBase'
  }
  if (_.isUndefined(RM[energyBase_state])) {
    RM[energyBase_state] = state_waitForDeposit
  }
  if (_.isUndefined(RM[energyBase_pionners])) {
    RM[energyBase_pionners] = []
  }


  //根据energyBase_state的状态进行建造
  //! 状态1：等待部署
  if (RM[energyBase_state] == state_waitForDeposit) {
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
    for (const creepName of RM[energyBase_pionners]) {
      if (Object.keys(Game.creeps).indexOf(creepName) == -1) {
        let indexToDelete = RM[energyBase_pionners].indexOf(creepName)
        RM[energyBase_pionners].splice(indexToDelete, 1)
      }
    }

    //没有就造一个
    if (RM[energyBase_pionners].length == 0) {
      let role1 = 'pionner_leader'
      let spawn = Game.spawns[spawnName]
      let pionnerName = `${role1}-${roomNameTo}-${Game.time}`
      let spawnResult = spawn.spawnCreep([WORK, CARRY, MOVE], pionnerName, { memory: { role: role1 } })
      if (spawnResult == OK) {
        //成功则记下pionnerName
        RM[energyBase_pionners].push(pionnerName)
      }
      return //? 

    }

    //若有pionner

    //! 正式开始开拓任务

    else {
      for (const pionnerName of RM[energyBase_pionners]) {
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


        //? 这段检查挪到前面？

        if (!startPos) {
          startPos = Game.spawns[spawnName].room.storage.pos
        }

        //! 状态1：等待部署
        //* 先去靠近起点旗子

        //若已靠近，则设为true
        if (pionner.pos.isNearTo(startPos)) {
          PM[toStart] = true
        }
        //若未靠近过，则尝试靠近
        if (PM[toStart] == false) {
          pionner.moveTo(startPos)
        }

        //* 开始铺路

        if (PM[toStart] == true) {


          //! 若未到达目标房间：
          //先仅铺路
          if (pionner.room.name !== roomNameTo) {




            //若无路径记忆，或路径房间过期 
            //  则赋予路径记忆

            //* 注意！ 这个路径只通向出口
            let pPath = 'pionner_path'
            if (_.isUndefined(PM[pPath])
              || PM[pathRoomName] != pionner.room.name) {
              PM[pPath] = pionner.pos.findPathTo(new RoomPosition(25, 25, roomNameTo), opt)
            }

            //* 进行铺路
            for (const pos of PM[pPath]) {
              pionner.room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD)
              // console.log('pionner.room.createConstructionSite(pos, STRUCTURE_ROAD): ', pionner.room.createConstructionSite(pos, STRUCTURE_ROAD));
            }

            //* 沿着路走
            let moveResult = pionner.moveByPath(PM[pPath])
            if (moveResult = ERR_NOT_FOUND) {
              PM[pPath] = pionner.pos.findPathTo(new RoomPosition(25, 25, roomNameTo), opt)
            }
            console.log(' pionner.moveByPath(PM[pPath]): ', pionner.moveByPath(PM[pPath]));

          }

          //! 若已到达目标房间

          else {
            //为防止来回exit，先往前走一步
            //* 因为这一步，等会铺路的时候要往脚下铺一格
            let oneStep = 'oneStep'
            if (_.isUndefined(pionner.memory[oneStep])) {
              pionner.memory[oneStep] = false
            }
            if (pionner.memory[oneStep] == false) {
              if (pionner.move(pionner.pos.getDirectionTo(25, 25)) == 0) {
                pionner.memory[oneStep] = true

              }
            }





            //开始准备铺路
            //! 分tick进行，方便重复利用道路
            //初始化tick为1
            let tick = 'tick'
            if (_.isUndefined(RM[tick])) {
              RM[tick] = 1
            }

            //! tick1: controller
            if (RM[tick] == 1) {
              //获取信息
              let controller = pionner.room.controller;
              let path_toController = pionner.pos.findPathTo(controller, opt);
              //铺路

              pionner.room.createConstructionSite(pionner.pos, STRUCTURE_ROAD)  //! 因为之前往房间里面走了一格
              for (let pos of path_toController) {
                // pionner.room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD)  //! 不给controller铺路了
              }

              //记录claimer工作位置，方便后续绕道
              let lastPos = path_toController[path_toController.length - 1]
              let workPos_claimer = { x: lastPos.x, y: lastPos.y, roomName: pionner.room.name } //? 待更改roomName的获取方式

              if (_.isUndefined(pionner.room.memory.energyBase)) {
                pionner.room.memory.energyBase = {}
              }
              pionner.room.memory.energyBase.workPos_claimer = workPos_claimer

              //* tick++
              RM[tick] += 1
              return
            }

            //! tick2: sourceS
            if (RM[tick] == 2) {
              let sources = pionner.room.find(FIND_SOURCES)
              RM.energyBase_sources = sources  //? 在这里存sources?
              // console.log('sources: ', sources);
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

              for (const s of sources) {
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
              for (const pos of posArrayForContainer) {
                pionner.room.createConstructionSite(pos.x, pos.y, STRUCTURE_CONTAINER)

                //顺便把container位置存到room.memory.energyBase里
                if (_.isUndefined(pionner.room.memory.energyBase.workPosArray_harvester)) {
                  pionner.room.memory.energyBase.workPosArray_harvester = []
                }
                toSaveInMemory.push({ x: pos.x, y: pos.y, roomName: pionner.room.name })
              }

              if (_.isUndefined(pionner.room.memory.energyBase.workPosArray_harvester)) {
                pionner.room.memory.energyBase.workPosArray_harvester = []
              }
              pionner.room.memory.energyBase.workPosArray_harvester = toSaveInMemory

              //* tick++
              RM[tick] += 1
              return
            }

            //! tick3: mine
            if (RM[tick] == 3) {
              /*
  ! 禁用了mine铺路开采
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
                  for (const pos in workPosArray_harvester) {
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
  
              */

              RM[tick] += 1 //?
              return



            }



            //* forDEBUG
            if (RM[tick] == 4) {

              let CTs = pionner.room.find(FIND_CONSTRUCTION_SITES)
              // for (let ct of CTs) {
              //   ct.remove()
              // }

              //如果这个时候发现一个CS也没放上，直接转为done状态
              if (CTs.length == 0) {
                RM[energyBase_state] = state_done
              }

              RM[tick] += 1
              return

            }

            if (RM[tick] == 5) {
              RM[tick] = 1
              RM[energyBase_state] = state_waitForBuilding

              //TODO 但是这样写和后面逻辑对不上
              //?最后把pionner转成remote builder 
              pionner.memory.role = 'remote_builder'//? 把硬编码提到前面去
            }

            //! 工地设置完成后设置为 状态2：待建状态


          }


        }


      }
    }
  }
  //! 状态阶段2： 等待建设
  if (RM[energyBase_state] == state_waitForBuilding) {

    //pionner转成builder

    //造几个pionner过去干活
    if (_.isUndefined(RM.energyBase_builders)) {
      RM.energyBase_builders = []
    }

    if (RM.energyBase_builders.length < 1) {
      let builderRole = 'remote_builder'
      let builderName = `remote_builder_${roomNameTo}_${Game.time}`
      let spawnReslt = Game.spawns[spawnName].spawnCreep(
        body([WORK, 3, CARRY, 3, MOVE, 3]),
        builderName,
        {
          memory: {
            role: builderRole,
            spawnRoom: spawnName.room,
            workRoom: roomNameTo,

          }
        }) //? 等待后续其他模块接管
      if (spawnReslt === 0) {
        RM.energyBase_builders.push(builderName)
      }
    }



    //生完了之后派他们干点事
    for (let i in RM.energyBase_builders) {

      //* /////////////////BUILDER控制///////////////////////
      let builderName = RM.energyBase_builders[i]
      let builder = Game.creeps[builderName]
      if (_.isUndefined(builder)) {
        RM.energyBase_builders.splice(i, 1)
        i--
        continue
      }



      //干事
      //先过去
      if (builder.room.name !== roomNameTo) {

        builder.moveTo(new RoomPosition(25, 25, roomNameTo), {
          reusePath: 50
        })
      }
      else {
        // console.log('1')
        //到了之后,没资源就挖挖，有资源就修路
        let doing = 'doing'
        let builderState_building = 'building'
        let builderState_harvesting = 'harvesting'

        if (_.isUndefined(builder.memory.doing)) {
          setDoing(builder, builderState_harvesting)

        }
        // console.log('2')
        if (builder.memory[doing] == builderState_building) {

          if (builder.store[RESOURCE_ENERGY] == 0) {
            setDoing(builder, builderState_harvesting)
          }

          if (_.isUndefined(RM.energyBase_constructionSites)) {
            let CSs = builder.room.find(FIND_CONSTRUCTION_SITES)
            RM.energyBase_constructionSites = CSs
          }

          let newestCS = RM.energyBase_constructionSites[RM.energyBase_constructionSites.length - 1]
          // console.log('newestCS: ', newestCS);
          if (_.isUndefined(newestCS)) {
            let CSs = builder.room.find(FIND_CONSTRUCTION_SITES)
            RM.energyBase_constructionSites = CSs

            if (CSs.length == 0) {
              RM[energyBase_state] = state_done//! 怎么写这了，待更改位置
            }
            return
          }
          let buildTarget = Game.getObjectById(RM.energyBase_constructionSites[RM.energyBase_constructionSites.length - 1].id)
          let buildResult = builder.build(buildTarget)//先修最新的
          console.log('buildResult: ', buildResult);
          //TODO 可以优化，先存找最近的
          if (buildResult == ERR_INVALID_TARGET) {
            //重寻建筑工地列表
            let CSs = builder.room.find(FIND_CONSTRUCTION_SITES)
            RM.energyBase_constructionSites = CSs
          }

          else if (buildResult == ERR_NOT_IN_RANGE) {
            builder.moveTo(buildTarget, { reusePath: 50 })
          }

        }



        if (builder.memory[doing] == builderState_harvesting) {

          if (builder.store.getFreeCapacity() === 0) {

            setDoing(builder, builderState_building)

          }

          //TODO 待修改builder的挖矿逻辑，可以实现分source挖矿
          let harvestTarget = Game.getObjectById(RM.energyBase_sources[0].id)
          let harvestResult = builder.harvest(harvestTarget)
          // console.log('harvestResult: ', harvestResult);
          if (harvestResult === ERR_NOT_IN_RANGE) {
            builder.moveTo(harvestTarget, { reusePath: 50 })
          }


        }

      }
      //TODO 判断路修完了没，修完则进入完工阶段，派正式员工上班（？修路阶段已经可以让大家上班了）




      // spawnByMinNumber(spawnName, remote_harvester, body([WORK, 8, CARRY, 1, MOVE, 4]), 1,
      //   {
      //     remote_harvester_containerID:abc,
      //     remote_harvester_sourceID: RM.energyBase_sources[0].id,
      //     spawnName: spawnName,
      //   })





      //* /////////////////BUILDER控制   结束///////////////////////

    }



  }
  if (RM[energyBase_state] == state_done) {


    //* 这时候就让其他员工上班，harvester,claimer,carrier
    //TODO 这些等会挪到前面
    let energyBase_harvesters = 'energyBase_harvesters'
    let energyBase_claimers = 'energyBase_claimers'
    let energyBase_carriers = 'energyBase_carriers'
    let energyBase_containers = 'energyBase_containers'

    if (_.isUndefined(RM[energyBase_harvesters])) {
      RM[energyBase_harvesters] = []
    }
    if (_.isUndefined(RM[energyBase_claimers])) {
      RM[energyBase_claimers] = []
    }

    if (_.isUndefined(RM[energyBase_carriers])) {
      RM[energyBase_carriers] = []
    }

    if (_.isUndefined(RM[energyBase_containers])) {
      //TODO 待添加container损坏时自动重建的逻辑
      //TODO 可以优化：仅保存id
      let containers = Game.rooms[roomNameTo].find(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_CONTAINER })//TODO 没视野怎么办？
      RM[energyBase_containers] = containers
    }

    if (_.isUndefined(RM[energyBase_sources])) {
      //TODO 待添加container损坏时自动重建的逻辑
      //TODO 可以优化：仅保存id
      let sources = Game.rooms[roomNameTo].find(FIND_SOURCES)//TODO 没视野怎么办？
      RM[energyBase_sources] = sources
    }

    //? HARD CODED !!!!!!!!!!!!!!!!!!!!!
    let remote_harvester = 'remote_harvester' + '_' + roomNameTo
    let remote_claimer = 'remote_claimer' + '_' + roomNameTo
    let remote_carrier = 'remote_carrier' + '_' + roomNameTo

    let harvesterNumber = RM[energyBase_sources].length
    // console.log('RM[energyBase_sources].length: ', RM[energyBase_sources].length);


    spawnByMinNumber(spawnName, remote_claimer, body([CLAIM, 2, MOVE, 1]), 1,
      {
        workRoom: roomNameTo
      })

    spawnByMinNumber(spawnName, remote_harvester, body([WORK, 8, CARRY, 1, MOVE, 4]), harvesterNumber,
      {
        workRoom: roomNameTo
      })


    spawnByMinNumber(spawnName, remote_carrier, body([WORK, 1, CARRY, 12, MOVE, 7]), harvesterNumber * 3,//TODO 需要添加评估系统
      {
        workRoom: roomNameTo
      })




  }

}




module.exports = buildEnergyBase