const { evalBody_worker_halfEnergy, evalBody_harvester, evalBody_carrier_halfEnergy, evalBody_worker_fullEnergy } = require("./spawn_evalBody")
const C = require("./util_consts")
const { spawnByMinNumber, body } = require("./util_helper")




/*

TODO 关于定位container和link，定位前未查找是否已有，可能出现建多个的情况

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

  let containerPos_sources = [],
    containerPos_controller = [],

    linkPos_sources = [],
    linkPos_controller = [],

    roadPos_sources = [],
    roadPos_mineral = [],
    roadPos_controller = [],

    extractorPos = []



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
      if (!pos) continue
      if (pos.type == STRUCTURE_ROAD) costs.set(pos.x, pos.y, 1)
      else {
        costs.set(pos.x, pos.y, 0xff)
      }

    }
    return costs;
  }



  //* 定出source的container和link

  for (let s of sources) {

    console.log('s: ', s.pos);
    let containerPos;
    let linkPos;

    // let { x, y } = s.pos;  //s的位置肯定是个墙
    //! AUX 先找到harvester的工作位置，帮助后续
    // console.log(111)
    let hPath = starter.findPathTo(s.pos, { ignoreCreeps: true, range: 1, swampCost: 2.1, plainCost: 2, costCallback: costCallback })
    // console.log(222)
    // console.log('hPath: ', hPath);

    let workPos = hPath[hPath.length - 1]

    containerPos = workPos;
    //确定link位置
    //原则：挨着container且不在路上
    //*前提： 旁边没有已建成的link
    //1.确定位置数组：与container距离为1，
    //2.getTerrain,此位置不是墙 且不在hPath中 则可以确定。 
    //

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
      console.log('terrain.get(pos.x, pos.y) != 1  : ', terrain.get(pos.x, pos.y) != 1);
      console.log('pos.x !== lastPath.x && pos.y !== lastPath.y: ', pos.x !== lastPath.x && pos.y !== lastPath.y);
      if (terrain.get(pos.x, pos.y) != 1    //不是墙
        && (pos.x !== lastPath.x && pos.y !== lastPath.y)) { //不挡路
        linkPos = pos;
        break;
      }

    }


    let nearbyStructures = new RoomPosition(workPos.x, workPos.y, room.name).findInRange(FIND_STRUCTURES, 3)

    if (nearbyStructures.filter(s => s.structureType == STRUCTURE_CONTAINER).length == 0) {
      containerPos_sources.push({ x: containerPos.x, y: containerPos.y, type: STRUCTURE_CONTAINER })
    }
    if (nearbyStructures.filter(s => s.structureType == STRUCTURE_LINK).length == 0) {
      linkPos_sources.push({ x: linkPos.x, y: linkPos.y, type: STRUCTURE_LINK, distance: hPath.length })
    }

    // console.log('linkPos_sources: ', linkPos_sources);

    for (let i = 0; i < hPath.length - 1; i++) {  //不为最后一位（container所在）建路
      let pos = hPath[i]
      roadPos_sources.push({ x: pos.x, y: pos.y, type: STRUCTURE_ROAD })
    }

  }
  //按照距离排列source link

  _.sortBy(linkPos_sources, (a) => -a.distance) //符号使得大的在前面


  // //* 定出controller的Link和container

  //* 定出controller的road
  if (room.controller.level >= 3) {
    let x = room.controller.pos.x;
    let y = room.controller.pos.y;
    let cPath = starter.findPathTo(x, y, { ignoreCreeps: true, range: 1, swampCost: 2.1, plainCost: 2, costCallback: costCallback })
    for (let pos of cPath) {

      roadPos_controller.push({ x: pos.x, y: pos.y, type: STRUCTURE_ROAD })
    }
    let nearbyStructures = room.controller.pos.findInRange(FIND_STRUCTURES, 3)
    if (_.filter(nearbyStructures, s => s.structureType == STRUCTURE_CONTAINER).length == 0) {
      containerPos_controller.push({ x: cPath[cPath.length - 2].x, y: cPath[cPath.length - 2].y, type: STRUCTURE_CONTAINER })
    }
    if (_.filter(nearbyStructures, s => s.structureType == STRUCTURE_LINK == 0).length) {
      linkPos_controller.push({ x: cPath[cPath.length - 1].x, y: cPath[cPath.length - 1].y, type: STRUCTURE_LINK })
    }
  }



  //* 定出mineral的road
  if (room.controller.level >= 5) {
    let { x, y } = room.find(FIND_MINERALS)[0].pos
    let mPath = starter.findPathTo(x, y, { ignoreCreeps: true, range: 1, swampCost: 2.1, plainCost: 2, costCallback: costCallback })
    for (let pos of mPath) {
      roadPos_mineral.push({ x: pos.x, y: pos.y, type: STRUCTURE_ROAD })
    }
  }

  //* 定出mineral的extractor
  if (room.controller.level >= 5) {
    let { x, y } = room.find(FIND_MINERALS)[0].pos
    extractorPos.push({ x: x, y: y, type: STRUCTURE_EXTRACTOR })
  }




  const result = {
    roadPos_controller,
    roadPos_mineral,
    roadPos_sources,

    linkPos_controller,
    linkPos_sources,

    containerPos_controller,
    containerPos_sources,

    extractorPos,
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

        //* 基地内的路 在这时修建 右上和右下部分

        //右上
        { x: x + 5, y: y - 4, type: STRUCTURE_ROAD },
        { x: x + 5, y: y - 2, type: STRUCTURE_ROAD },
        { x: x + 4, y: y - 3, type: STRUCTURE_ROAD },
        { x: x + 3, y: y - 4, type: STRUCTURE_ROAD },
        { x: x + 3, y: y - 2, type: STRUCTURE_ROAD },
        { x: x + 2, y: y - 1, type: STRUCTURE_ROAD },

        //右下
        { x: x + 6, y: y + 5, type: STRUCTURE_ROAD },
        { x: x + 5, y: y + 4, type: STRUCTURE_ROAD },
        { x: x + 4, y: y + 3, type: STRUCTURE_ROAD },
        { x: x + 3, y: y + 2, type: STRUCTURE_ROAD },
        { x: x + 2, y: y + 1, type: STRUCTURE_ROAD },

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

        //* link
        { x: x, y: y - 1, type: STRUCTURE_LINK },        //! 级时先修一个最远的source到conrtoller的 ，6级再修基地的
      ])

      if (locate) {
        CTs = CTs.concat(
          sth.extractorPos
        )
      }
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


        //* tower
        { x: towerX - 1, y: towerY, type: STRUCTURE_TOWER },
      ])

      if (locate) {

        CTs = CTs.concat(sth.roadPos_mineral,
          sth.linkPos_sources[0],
          sth.linkPos_controller[0])
      }

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
        // // 已解决？ ! 因为预留位置寻路时不可通行，所以先注释了。可以把本列表的条件也加入false中
        //左
        { x: x - 2, y: y, type: STRUCTURE_ROAD },
        { x: x - 3, y: y, type: STRUCTURE_ROAD },
        { x: x - 4, y: y, type: STRUCTURE_ROAD },
        { x: x - 5, y: y, type: STRUCTURE_ROAD },
        { x: x - 6, y: y, type: STRUCTURE_ROAD },
        //右
        { x: x + 2, y: y, type: STRUCTURE_ROAD },
        { x: x + 3, y: y, type: STRUCTURE_ROAD },
        { x: x + 4, y: y, type: STRUCTURE_ROAD },
        { x: x + 5, y: y, type: STRUCTURE_ROAD },
        { x: x + 6, y: y, type: STRUCTURE_ROAD },
        //下
        { x: x, y: y + 2, type: STRUCTURE_ROAD },
        { x: x, y: y + 3, type: STRUCTURE_ROAD },
        { x: x, y: y + 4, type: STRUCTURE_ROAD },
        { x: x, y: y + 5, type: STRUCTURE_ROAD },
        { x: x, y: y + 6, type: STRUCTURE_ROAD },

        // { x: x - 2, y: y, type: STRUCTURE_ROAD },
        // { x: x - 3, y: y, type: STRUCTURE_ROAD },
        // { x: x - 4, y: y, type: STRUCTURE_ROAD },
        // { x: x - 5, y: y, type: STRUCTURE_ROAD },

        //中
        { x: x, y: y, type: STRUCTURE_ROAD },
        { x: x + 1, y: y + 1, type: STRUCTURE_ROAD },
        { x: x + 1, y: y - 1, type: STRUCTURE_ROAD },
        { x: x - 1, y: y + 1, type: STRUCTURE_ROAD },
        { x: x - 1, y: y - 1, type: STRUCTURE_ROAD },



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

      if (locate) {

        //* ROAD TO SOURCE
        //* ROAD TO CONTROLLER
        CTs = CTs.concat(sth.roadPos_sources, sth.roadPos_controller)

      }



    case 2:
      CTs = CTs.concat([
        { x: x - 6, y: y - 5, type: STRUCTURE_EXTENSION },
        { x: x - 6, y: y - 4, type: STRUCTURE_EXTENSION },
        { x: x - 6, y: y - 3, type: STRUCTURE_EXTENSION },
        { x: x - 6, y: y - 2, type: STRUCTURE_EXTENSION },
        { x: x - 6, y: y - 1, type: STRUCTURE_EXTENSION },  //5
      ])

      if (locate) {

        //* source的container
        //* controller的container
        CTs = CTs.concat(sth.containerPos_sources, sth.containerPos_controller)

      }

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
  console.log('CTs: ', CTs);
  for (let s of CTs) {
    if (!(s && s.x && s.y && s.type)) {
      continue
    }
    if (s.type == STRUCTURE_SPAWN) {
      continue
    }
    let { x, y, type } = s
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
      }
      else {
        placeCT(flag, rcl)
      }


      break;
    case 6:
      spawnByMinNumber(spawnName, 'upgrader_' + targetRoom, evalBody_worker_halfEnergy(spawnName), 4)

      spawnByMinNumber(spawnName, 'harvesterPlus_' + targetRoom, evalBody_harvester(spawnName), 2)

      spawnByMinNumber(spawnName, 'carrier_' + targetRoom, evalBody_carrier_halfEnergy(spawnName), 2)

      spawnByMinNumber(spawnName, 'base_transferor_' + targetRoom, evalBody_carrier_halfEnergy(spawnName), 1)

      if (flag.room.mineral.mineralAmount > 0) {
        spawnByMinNumber(spawnName, 'miner_' + targetRoom, evalBody_worker_halfEnergy(spawnName), 1)
      }

      if (flag.room.cts && flag.room.cts.length > 0) {
        spawnByMinNumber(spawnName, 'builder_' + targetRoom, evalBody_worker_halfEnergy(spawnName), 2)
      }
      else {
        placeCT(flag, rcl)
      }
Game.market.createOrder()

      break;
    case 7:
      spawnByMinNumber(spawnName, 'upgrader_' + targetRoom, body([WORK, 20, CARRY, 2, MOVE, 11]), 1)

      spawnByMinNumber(spawnName, 'harvesterPlus_' + targetRoom, evalBody_harvester(spawnName), 2)

      spawnByMinNumber(spawnName, 'carrier_' + targetRoom, evalBody_carrier_halfEnergy(spawnName), 1)

      spawnByMinNumber(spawnName, 'base_transferor_' + targetRoom, evalBody_carrier_halfEnergy(spawnName), 1)

      if (flag.room.mineral.mineralAmount > 0) {
        spawnByMinNumber(spawnName, 'miner_' + targetRoom, evalBody_worker_halfEnergy(spawnName), 1)
      }

      if (flag.room.cts && flag.room.cts.length > 0) {
        spawnByMinNumber(spawnName, 'builder_' + targetRoom, evalBody_worker_halfEnergy(spawnName), 2)
      }
      else {
        placeCT(flag, rcl)
      }
      break;
    case 8:
      break;
  }





}


module.exports = developNewRoom