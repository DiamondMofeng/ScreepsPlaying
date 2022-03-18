const { evalBody_worker_halfEnergy, evalBody_harvester, evalBody_carrier_halfEnergy, evalBody_worker_fullEnergy } = require("./spawn_evalBody")
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
    roadPos_sources: [],
    roadPos_mineral: [],
    roadPos_controller: []
  }

  let costCallback = function (roomName) {

    let room = Game.rooms[roomName];
    if (_.isUndefined(room)) return false;

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
    let reservedPos = CTinfos(starter, 8, false)
    for (pos of reservedPos) {
      // console.log(JSON.stringify(pos))
      if (!pos) continue
      costs.set(pos.x, pos.y, 0xff)

    }
    return costs;
  }



  //* 定出source的container和link

  for (let s of sources) {
    // console.log('s: ', s);
    let containerPos;
    let linkPos;

    let { x, y } = s.pos;  //s的位置肯定是个墙
    // console.log(' s.pos: ', s.pos);
    // console.log('x, y: ', x, y);
    // console.log('starter: ', starter);
    //! AUX 先找到harvester的工作位置，帮助后续

    let hPath = starter.findPathTo(s.pos, { ignoreCreeps: true, range: 1, swampCost: 2.1, plainCost: 2, costCallback: costCallback })
    // console.log('starter.findPathTo(s.pos, { ignoreCreeps: true, range: 1, swampCost: 2.1, plainCost: 2, costCallback: costCallback }): ', starter.findPathTo(s.pos, { ignoreCreeps: true, range: 1, swampCost: 2.1, plainCost: 2, costCallback: costCallback }));
    
    // console.log('hPath: ', hPath);
    // console.log('hPath: ', typeof hPath);
    let workPos = hPath[hPath.length - 1]
    // console.log('workPos: ', workPos);

    

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

    for (let i = 0; i < hPath.length - 1; i++) {  //不为最后一位（container所在）建路
      let pos = hPath[i]
      result.roadPos_sources.push({ x: pos.x, y: pos.y, type: STRUCTURE_ROAD })
    }

  }


  // //* 定出controller的Link和container




  //* 定出controller的road
  if (room.controller.level >= 3) {
    let x = room.controller.pos.x;
    let y = room.controller.pos.y;
    let cPath = starter.findPathTo(x, y, { ignoreCreeps: true, range: 2, swampCost: 2.1, plainCost: 2, costCallback: costCallback })
    for (let pos of cPath) {

      result.roadPos_controller.push({ x: pos.x, y: pos.y, type: STRUCTURE_ROAD })
    }
  }



  //* 定出mineral的road
  if (room.controller.level >= 6) {
    let { x, y } = room.find(FIND_MINERALS)[0].pos
    let mPath = starter.findPathTo(x, y, { ignoreCreeps: true, range: 1, swampCost: 2.1, plainCost: 2, costCallback: costCallback })
    for (let pos of mPath) {
      result.roadPos_mineral.push({ x: pos.x, y: pos.y, type: STRUCTURE_ROAD })
    }
  }







  return result
}






/**
 * 
 * @param {String|Flag|RoomPosition} flag 
 * @param {Number} rcl 
 * @param {boolean} locate 
 * @returns {Array}
 */
const CTinfos = (flag, rcl, locate = true) => {


  let starterPos
  if (typeof flag == 'string') {
    flag = Game.flags[flag]
  }
  if (flag instanceof RoomObject) {
    starterPos = flag.pos
  }
  if (flag instanceof RoomPosition) {
    starterPos = flag
  }



  let x = starterPos.x;
  let y = starterPos.y;
  let CTs = [];

  let towerX = x;
  let towerY = y + 4;

  let sth = []
  if (locate == true) {
    sth = locateSomething_byAux(flag.room, flag.pos)
  }

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


        { type: STRUCTURE_LAB, x: x + 5, y: y + 3 },
        { type: STRUCTURE_LAB, x: x + 5, y: y + 5 },
        { type: STRUCTURE_LAB, x: x + 6, y: y + 3 },
        { type: STRUCTURE_LAB, x: x + 6, y: y + 4 },

        { type: STRUCTURE_TOWER, x: towerX + 1, y: towerY - 1 },
        { type: STRUCTURE_TOWER, x: towerX + 1, y: towerY },
        { type: STRUCTURE_TOWER, x: towerX + 1, y: towerY + 1 },

        { type: STRUCTURE_SPAWN, x: x, y: y - 5 }, //3 at 8

        { type: STRUCTURE_POWER_SPAWN, x: x + 3, y: y + 1 },

        { type: STRUCTURE_NUKER, x: x + 4, y: y + 1 },

        { type: STRUCTURE_OBSERVER, x: x + 5, y: y + 1 },
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

        { type: STRUCTURE_LAB, x: x + 4, y: y + 4 },
        { type: STRUCTURE_LAB, x: x + 4, y: y + 5 },
        { type: STRUCTURE_LAB, x: x + 5, y: y + 2 },

        { type: STRUCTURE_TOWER, x: towerX - 1, y: towerY + 1 },

        { type: STRUCTURE_FACTORY, x: x + 1, y: y },

        { type: STRUCTURE_SPAWN, x: x, y: y - 4 }, //2 at 7
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



        { type: STRUCTURE_LAB, x: x + 3, y: y + 3 },
        { type: STRUCTURE_LAB, x: x + 3, y: y + 4 },
        { type: STRUCTURE_LAB, x: x + 4, y: y + 2 },

        { type: STRUCTURE_TERMINAL, x: x, y: y + 1 },

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

        //* link
        // { x: x, y: y - 1, type: STRUCTURE_LINK },        //!先修一个最远的source到conrtoller的

        //* tower
        { x: towerX - 1, y: towerY, type: STRUCTURE_TOWER },
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
        { x: x - 1, y: y, type: STRUCTURE_STORAGE },

        //* 基地内的路 在这时修建 十字路 与 左上和左下部分

        //左上
        { x: x - 5, y: y - 4, type: STRUCTURE_ROAD },
        { x: x - 5, y: y - 2, type: STRUCTURE_ROAD },
        { x: x - 4, y: y - 3, type: STRUCTURE_ROAD },
        { x: x - 3, y: y - 4, type: STRUCTURE_ROAD },
        { x: x - 3, y: y - 2, type: STRUCTURE_ROAD },
        { x: x - 2, y: y - 1, type: STRUCTURE_ROAD },

        //左下
        { x: x - 5, y: y + 4, type: STRUCTURE_ROAD },
        { x: x - 5, y: y + 2, type: STRUCTURE_ROAD },
        { x: x - 4, y: y + 3, type: STRUCTURE_ROAD },
        { x: x - 3, y: y + 4, type: STRUCTURE_ROAD },
        { x: x - 3, y: y + 2, type: STRUCTURE_ROAD },
        { x: x - 2, y: y + 1, type: STRUCTURE_ROAD },

        //十字干道  
        //! 因为预留位置寻路时不可通行，所以先注释了。可以把本列表的条件也加入false中
        //左
        // { x: x - 2, y: y, type: STRUCTURE_ROAD },
        // { x: x - 3, y: y, type: STRUCTURE_ROAD },
        // { x: x - 4, y: y, type: STRUCTURE_ROAD },
        // { x: x - 5, y: y, type: STRUCTURE_ROAD },
        // { x: x - 6, y: y, type: STRUCTURE_ROAD },
        // //右
        // { x: x + 2, y: y, type: STRUCTURE_ROAD },
        // { x: x + 3, y: y, type: STRUCTURE_ROAD },
        // { x: x + 4, y: y, type: STRUCTURE_ROAD },
        // { x: x + 5, y: y, type: STRUCTURE_ROAD },
        // { x: x + 6, y: y, type: STRUCTURE_ROAD },
        // //下
        // { x: x, y: y + 2, type: STRUCTURE_ROAD },
        // { x: x, y: y + 3, type: STRUCTURE_ROAD },
        // { x: x, y: y + 4, type: STRUCTURE_ROAD },
        // { x: x, y: y + 5, type: STRUCTURE_ROAD },
        // { x: x, y: y + 6, type: STRUCTURE_ROAD },

        // { x: x - 1, y: y, type: STRUCTURE_ROAD },
        // { x: x - 2, y: y, type: STRUCTURE_ROAD },
        // { x: x - 3, y: y, type: STRUCTURE_ROAD },
        // { x: x - 4, y: y, type: STRUCTURE_ROAD },
        // { x: x - 5, y: y, type: STRUCTURE_ROAD },

        // //中
        // { x: x + 1, y: y + 1, type: STRUCTURE_ROAD },
        // { x: x + 1, y: y - 1, type: STRUCTURE_ROAD },
        // { x: x - 1, y: y + 1, type: STRUCTURE_ROAD },
        // { x: x - 1, y: y - 1, type: STRUCTURE_ROAD },



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
      CTs = CTs.concat(sth.roadPos_sources)

      //* ROAD TO CONTROLLER
      CTs = CTs.concat(sth.roadPos_controller)



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
    if (type == STRUCTURE_SPAWN) {
      continue
    }
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
      spawnByMinNumber(spawnName, 'carrier_' + targetRoom, evalBody_carrier_halfEnergy(spawnName), 2)

      if (flag.room.cts && flag.room.cts.length > 0) {
        spawnByMinNumber(spawnName, 'builder_' + targetRoom, evalBody_worker_halfEnergy(spawnName, { haveRoad: false }), 1)
      } else {
        placeCT(flag, rcl)
      }



      break;
    case 3:

      spawnByMinNumber(spawnName, 'upgrader_' + targetRoom, evalBody_worker_halfEnergy(spawnName), 5)
      spawnByMinNumber(spawnName, 'harvesterPlus_' + targetRoom, evalBody_harvester(spawnName), 2)
      spawnByMinNumber(spawnName, 'carrier_' + targetRoom, evalBody_carrier_halfEnergy(spawnName), 2)

      if (flag.room.cts && flag.room.cts.length > 0) {
        spawnByMinNumber(spawnName, 'builder_' + targetRoom, evalBody_worker_halfEnergy(spawnName), 2)
      } else {
        placeCT(flag, rcl)
      }


      break;
    case 4:



      

      spawnByMinNumber(spawnName, 'upgrader_' + targetRoom, evalBody_worker_halfEnergy(spawnName), 4)

      spawnByMinNumber(spawnName, 'carrier_' + targetRoom, evalBody_carrier_halfEnergy(spawnName), 2)

      spawnByMinNumber(spawnName, 'harvesterPlus_' + targetRoom, evalBody_harvester(spawnName), 2)

      if (flag.room.cts && flag.room.cts.length > 0) {
        spawnByMinNumber(spawnName, 'builder_' + targetRoom, evalBody_worker_halfEnergy(spawnName), 2)
      } else {
        placeCT(flag, rcl)
      }

      

      break;
    case 5:

      spawnByMinNumber(spawnName, 'upgrader_' + targetRoom, evalBody_worker_halfEnergy(spawnName), 4)

      spawnByMinNumber(spawnName, 'harvesterPlus_' + targetRoom, evalBody_harvester(spawnName), 2)

      spawnByMinNumber(spawnName, 'carrier_' + targetRoom, evalBody_carrier_halfEnergy(spawnName), 2)

      

      if (flag.room.cts && flag.room.cts.length > 0) {
        spawnByMinNumber(spawnName, 'builder_' + targetRoom, evalBody_worker_halfEnergy(spawnName), 2)
      } else {
        placeCT(flag, rcl)
      }


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