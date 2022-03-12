const { evalBody_worker_halfEnergy, evalBody_harvester } = require("./spawn_evalBody")
const C = require("./util_consts")
const { spawnByMinNumber, body } = require("./util_helper")




/*

思路:分RCL进行发展。

*================= RCL1:===============
造upgrader到2级




*================= RCL2:===============
按坐标放5个ext,
每个矿对应放一个container
生产harvesterPlus和builder和upgrader



*================= RCL3:===============
放5个ext(共10)
放tower
给每个source和controller铺路
*================= RCL4:===============
放10个ext(共20)

*================= RCL5:===============
放10个ext(共30)

*================= RCL6:===============
放10个ext(共40)

*================= RCL7:===============

放10个ext(共50)
*================= RCL8:===============

放10个ext(共60)



* 出creep策略：
还是by min number，但是在房间的memory里设置spawn queue,每5tick spawn尝试生成队列前面的creep。

body自动由评估决定。每种worker尽量少，保持n*harvester,1*upgrader,1*carrier（+1*base transeferor), (1)*builder即可，共4~6个creep








*/




/**
 * 定出
 * 
 * source的container,link,
 * 
 * upgrade的container,link位置
 * @param {Room|String} room 
 */
const locateSomething = (room) => {
  if (typeof room == 'string') {
    room = Game.rooms[room]
  }
  if (!room || room.controller.owner.username != C.myName) {
    return
  }

  let sources = room.find(FIND_SOURCES);
  let controller = room.controller;

  let terrain = room.getTerrain();

  //* 定出source的container和link

  for (let s of sources) {
    let { x, y } = s.pos;  //s的位置肯定是个墙



  }





}


/**
 * 鉴于比较难写，用了一个starter做寻位辅助
 * @param {String|Room} room 
 * @param {RoomPosition} starter 
 * @returns {Object} result
 * @result {  
 * containerPos:[ ]  
 * linkPos:[ ]  
 * }
 */
const locateSomething_byAux = (room, starter) => {

  if (typeof room == 'string') {
    room = Game.rooms[room]
  }

  if (!room || room.controller.owner.username != C.myName) {
    return
  }


  let sources = room.find(FIND_SOURCES);
  let controller = room.controller;

  let terrain = room.getTerrain();

  let result = {
    containerPos: [],
    linkPos: [],
    roadPos: [],
  }

  let costCallback = function (roomName) {

    let room = Game.rooms[roomName];
    if (_.isUndefined(room)) return;

    let costs = new PathFinder.CostMatrix;


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


    return costs;
  }


  //* 定出source的container和link

  for (let s of sources) {
    let containerPos;
    let linkPos;

    let { x, y } = s.pos;  //s的位置肯定是个墙

    //! AUX 先找到harvester的工作位置，帮助后续

    let hPath = starter.findPathTo(x, y, { ignoreCreeps: true, range: 1, swampCost: 1, plainCost: 1, costCallback: costCallback })
    let workPos = hPath[hPath.length - 1]

    containerPos = workPos;
    //确定link位置
    //原则：挨着container且不在路上
    //1.确定位置数组：与container距离为1，
    //2.getTerrain,此位置不是墙 且不在hPath中 则可以确定。 

    //{ x: 10, y: 5, dx: 1,  dy: 0, direction: RIGHT }
    let lastPath = hPath[hPath.length - 1 - 1]

    let possiblePos = [
      { x: workPos.x + 1, y: workPos.y + 1 },
      { x: workPos.x + 1, y: workPos.y + 0 },
      { x: workPos.x + 1, y: workPos.y - 1 },
      { x: workPos.x + 0, y: workPos.y + 1 },
      { x: workPos.x + 0, y: workPos.y - 1 },
      { x: workPos.x - 1, y: workPos.y + 1 },
      { x: workPos.x - 1, y: workPos.y + 0 },
      { x: workPos.x - 1, y: workPos.y - 1 },
    ]; //! 硬编码

    for (let pos of possiblePos) {
      if (terrain.get(pos.x, pos.y) != 1    //不是墙
        && (pos.x !== lastPath.x && pos.y !== lastPath.y)) { //不挡路
        linkPos = pos;
        break;
      }

    }

    result.containerPos.push({ x: containerPos.x, y: containerPos.y, type: STRUCTURE_CONTAINER })
    result.linkPos.push({ x: linkPos.x, y: linkPos.y, type: STRUCTURE_LINK })

    for (let pos of hPath) {
      result.roadPos.push({ x: pos.x, y: pos.y, type: STRUCTURE_ROAD })
    }

  }


  //* 定出controller的Link和container


  return result
}






/**
 * 格式：[x,y,typeConst]
 */
const CTinfos = (flag, rcl) => {
  let x = flag.pos.x;
  let y = flag.pos.y
  let CTs = [];

  let towerX = x;
  let towerY = y + 4;

  let sth = locateSomething_byAux(flag.room, flag.pos)
  switch (rcl) {
    case 8:
      CTs = CTs.concat([


        { x: x + 3, y: y - 5, type: STRUCTURE_EXTENSION },
        { x: x + 3, y: y - 3, type: STRUCTURE_EXTENSION },
        { x: x + 3, y: y - 1, type: STRUCTURE_EXTENSION },
        { x: x + 2, y: y - 5, type: STRUCTURE_EXTENSION },
        { x: x + 2, y: y - 4, type: STRUCTURE_EXTENSION },
        { x: x + 2, y: y - 3, type: STRUCTURE_EXTENSION },
        { x: x + 2, y: y - 2, type: STRUCTURE_EXTENSION },  //57
      ])
    case 7:
      CTs = CTs.concat([

        { x: x + 6, y: y - 3, type: STRUCTURE_EXTENSION },
        { x: x + 6, y: y - 2, type: STRUCTURE_EXTENSION },
        { x: x + 6, y: y - 1, type: STRUCTURE_EXTENSION },
        { x: x + 5, y: y - 5, type: STRUCTURE_EXTENSION },
        { x: x + 5, y: y - 3, type: STRUCTURE_EXTENSION },
        { x: x + 5, y: y - 1, type: STRUCTURE_EXTENSION },
        { x: x + 4, y: y - 5, type: STRUCTURE_EXTENSION },
        { x: x + 4, y: y - 4, type: STRUCTURE_EXTENSION },
        { x: x + 4, y: y - 2, type: STRUCTURE_EXTENSION },
        { x: x + 4, y: y - 1, type: STRUCTURE_EXTENSION },  //50

      ])
    case 6:
      CTs = CTs.concat([

        { x: x - 2, y: y - 5, type: STRUCTURE_EXTENSION },
        { x: x - 2, y: y - 4, type: STRUCTURE_EXTENSION },
        { x: x - 2, y: y - 3, type: STRUCTURE_EXTENSION },
        { x: x - 2, y: y - 2, type: STRUCTURE_EXTENSION },
        { x: x - 2, y: y + 5, type: STRUCTURE_EXTENSION },
        { x: x - 2, y: y + 4, type: STRUCTURE_EXTENSION },
        { x: x - 2, y: y + 3, type: STRUCTURE_EXTENSION },
        { x: x - 2, y: y + 2, type: STRUCTURE_EXTENSION },
        { x: x + 6, y: y - 5, type: STRUCTURE_EXTENSION },
        { x: x + 6, y: y - 4, type: STRUCTURE_EXTENSION },  //40

      ])
    case 5:
      CTs = CTs.concat([

        { x: x - 4, y: y + 5, type: STRUCTURE_EXTENSION },
        { x: x - 4, y: y + 4, type: STRUCTURE_EXTENSION },
        { x: x - 4, y: y + 2, type: STRUCTURE_EXTENSION },
        { x: x - 4, y: y + 1, type: STRUCTURE_EXTENSION },
        { x: x - 3, y: y - 5, type: STRUCTURE_EXTENSION },
        { x: x - 3, y: y - 3, type: STRUCTURE_EXTENSION },
        { x: x - 3, y: y - 1, type: STRUCTURE_EXTENSION },
        { x: x - 3, y: y + 5, type: STRUCTURE_EXTENSION },
        { x: x - 3, y: y + 3, type: STRUCTURE_EXTENSION },
        { x: x - 3, y: y + 1, type: STRUCTURE_EXTENSION },  //30


      ])
    case 4:
      CTs = CTs.concat([

        //* EXT
        { x: x - 5, y: y - 5, type: STRUCTURE_EXTENSION },
        { x: x - 5, y: y - 3, type: STRUCTURE_EXTENSION },
        { x: x - 5, y: y - 1, type: STRUCTURE_EXTENSION },
        { x: x - 5, y: y + 5, type: STRUCTURE_EXTENSION },
        { x: x - 5, y: y + 3, type: STRUCTURE_EXTENSION },
        { x: x - 5, y: y + 1, type: STRUCTURE_EXTENSION },
        { x: x - 4, y: y - 5, type: STRUCTURE_EXTENSION },
        { x: x - 4, y: y - 4, type: STRUCTURE_EXTENSION },
        { x: x - 4, y: y - 2, type: STRUCTURE_EXTENSION },
        { x: x - 4, y: y - 1, type: STRUCTURE_EXTENSION },  //20

        //* storage
        { x: x - 1, y: y, type: STRUCTURE_STORAGE }

      ])



    case 3:
      CTs = CTs.concat([
        //* EXT
        { x: x - 6, y: y + 5, type: STRUCTURE_EXTENSION },
        { x: x - 6, y: y + 4, type: STRUCTURE_EXTENSION },
        { x: x - 6, y: y + 3, type: STRUCTURE_EXTENSION },
        { x: x - 6, y: y + 2, type: STRUCTURE_EXTENSION },
        { x: x - 6, y: y + 1, type: STRUCTURE_EXTENSION },  //10

        //* TOWER
        { x: towerX - 1, y: towerY - 1, type: STRUCTURE_TOWER },
      ])

      //* ROAD TO SOURCE
      CTs = CTs.concat(sth.roadPos)


    case 2:
      CTs = CTs.concat([
        { x: x - 6, y: y - 5, type: STRUCTURE_EXTENSION },
        { x: x - 6, y: y - 4, type: STRUCTURE_EXTENSION },
        { x: x - 6, y: y - 3, type: STRUCTURE_EXTENSION },
        { x: x - 6, y: y - 2, type: STRUCTURE_EXTENSION },
        { x: x - 6, y: y - 1, type: STRUCTURE_EXTENSION },  //5
      ])


      //* source的container
      CTs = CTs.concat(sth.containerPos)

      break;
    case 1:
      return CTs;

  }

  return CTs;




}


/**
 * 
 * @param {Flag} flag 
 * @param {Number} rcl 
 */
const placeCT = (flag, rcl) => {

  if (Game.time % 100 != 0) {
    return
  }

  let CTs = CTinfos(flag, rcl)
  for ({ x, y, type } of CTs) {
    // console.log('flag.room.: ', flag.room, x, y, type);
    flag.room.createConstructionSite(x, y, type)
  }

}



const RCL1 = () => {
  spawnByMinNumber(spawnName, 'upgrader_' + targetRoom, [WORK, MOVE, CARRY, MOVE], 3)

}

const RCL2 = () => {

}








/**
 * 前往指定旗子放下spawn
 * @param {Flag|String} flag 
 * @param {String} targetRoom
 */
const developNewRoom = (flag, targetRoom, opt = {}) => {

  //* 默认此时已建好spawn，根据flag的位置和rcl自动摆放建筑、生产creep

  if (typeof flag == 'string') {
    flag = Game.flags[flag]
  }

  if (!flag) {
    return
  }

  let spawnName = targetRoom + '_0'  //TODO 到时候用生产队列代替

  if (Game.spawns[spawnName] == undefined) {
    return
  }
  let rcl = Game.rooms[targetRoom].controller.level
  switch (rcl) {
    case 1:
      RCL1();

      break;
    case 2:

      spawnByMinNumber(spawnName, 'upgrader_' + targetRoom, evalBody_worker_halfEnergy(spawnName, { haveRoad: false }), 5)
      spawnByMinNumber(spawnName, 'harvesterPlus_' + targetRoom, evalBody_harvester(spawnName), 2)
      spawnByMinNumber(spawnName, 'sweepper_' + targetRoom, [MOVE, MOVE, CARRY, CARRY, MOVE, CARRY,], 1)

      if (flag.room.cts && flag.room.cts.length > 0) {
        spawnByMinNumber(spawnName, 'builder_' + targetRoom, evalBody_worker_halfEnergy(spawnName, { haveRoad: false }), 1)
      }

      placeCT(flag, rcl)
      break;
    case 3:

      spawnByMinNumber(spawnName, 'upgrader_' + targetRoom, evalBody_worker_halfEnergy(spawnName), 5)
      spawnByMinNumber(spawnName, 'harvesterPlus_' + targetRoom, evalBody_harvester(spawnName), 2)
      spawnByMinNumber(spawnName, 'sweepper_' + targetRoom, [MOVE, MOVE, CARRY, MOVE, CARRY, CARRY], 1)
      spawnByMinNumber(spawnName, 'builder_' + targetRoom, evalBody_worker_halfEnergy(spawnName), 2)


      placeCT(flag, rcl)

      break;
    case 4:
      break;
    case 5:
      break;
    case 6:
      break;
    case 7:
      break;
    case 8:
      break;
  }





}


module.exports = developNewRoom