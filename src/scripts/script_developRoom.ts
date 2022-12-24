/* eslint-disable no-fallthrough */

import { isStructureType } from "@/utils/typer";
import _ from "lodash";

const INTERVAL_PLACE_CONSTRUCTION_SITES = 5;

interface PlannedStructure {
  x: number,
  y: number,
  type: BuildableStructureConstant,
}

interface PlannedLink extends PlannedStructure {
  x: number,
  y: number,
  type: STRUCTURE_LINK,
  distance: number
}



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




// /**
//  * 定出
//  * 
//  * source的container,link,
//  * 
//  * upgrade的container,link位置
//  * @param {Room|String} room 
//  */
// const locateSomething = (room) => {
//   if (typeof room == 'string') {
//     room = Game.rooms[room]
//   }
//   if (!room || room.controller.owner.username != myName) {
//     return
//   }

//   let sources = room.find(FIND_SOURCES);
//   let controller = room.controller;

//   let terrain = room.getTerrain();

//   //* 定出source的container和link

//   for (let s of sources) {
//     let { x, y } = s.pos;  //s的位置肯定是个墙



//   }





// }


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
const locateSomething_byAux = (room: string | Room, starter: RoomPosition) => {

  if (typeof room == 'string') {
    room = Game.rooms[room]
  }

  if (!room.controller?.my) {
    return
  }

  let sources = room.find(FIND_SOURCES);

  let terrain = room.getTerrain();

  let containerPos_sources: PlannedStructure[] = [],
    containerPos_controller: PlannedStructure[] = [],

    linkPos_sources: PlannedLink[] = [],
    linkPos_controller: PlannedStructure[] = [],

    roadPos_sources: PlannedStructure[] = [],
    roadPos_mineral: PlannedStructure[] = [],
    roadPos_controller: PlannedStructure[] = [],

    extractorPos: PlannedStructure[] = []



  let costCallback = function (roomName: string) {

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
    let reservedPos = CTinfos(starter, 8, false)
    for (const pos of reservedPos) {
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

    let containerPos;
    let linkPos;

    // let { x, y } = s.pos;  //s的位置肯定是个墙
    //! AUX 先找到harvester的工作位置，帮助后续
    let hPath = starter.findPathTo(s.pos, { ignoreCreeps: true, range: 1, swampCost: 2.1, plainCost: 2, costCallback: costCallback })
    // console.log('hPath: ', hPath);
    let workPos: { x: number, y: number } = hPath[hPath.length - 1]
    // console.log('workPos: ', JSON.stringify(workPos));

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
      [+ 1, + 1],
      [+ 1, + 0],
      [+ 1, - 1],
      [+ 0, + 1],
      [+ 0, - 1],
      [- 1, + 1],
      [- 1, + 0],
      [- 1, - 1],
    ];

    let possibleContainers = s.pos.findInRange(FIND_STRUCTURES, 1, { filter: isStructureType(STRUCTURE_CONTAINER) })
    if (possibleContainers.length > 0) {
      if (possibleContainers.length > 1) {
        //TODO use warning logger here
        console.log('定位link时，发现source附近有多个container,导致结果可能不准');
      }
      workPos = possibleContainers[0].pos
    }

    linkPos = possiblePos
      .map(pos => ({ x: workPos.x + pos[0], y: workPos.y + pos[1] }))
      .find(pos => terrain.get(pos.x, pos.y) != TERRAIN_MASK_WALL && (pos.x !== lastPath.x || pos.y !== lastPath.y))

    //TODO 可以map之后sort一下，让位置更接近基地
    
    // console.log('linkPos: ', JSON.stringify(linkPos));


    let nearbyStructures = new RoomPosition(workPos.x, workPos.y, room.name).findInRange(FIND_STRUCTURES, 3)

    if (nearbyStructures.filter(s => s.structureType == STRUCTURE_CONTAINER).length == 0) {
      containerPos_sources.push({ x: containerPos.x, y: containerPos.y, type: STRUCTURE_CONTAINER })
    }
    if (nearbyStructures.filter(s => s.structureType == STRUCTURE_LINK).length == 0) {
      if (linkPos) {
        linkPos_sources.push({ x: linkPos.x, y: linkPos.y, type: STRUCTURE_LINK, distance: hPath.length })
      }
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
    if (_.filter(nearbyStructures, s => s.structureType == STRUCTURE_LINK).length == 0) {
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
const CTinfos = (flag: string | Flag | RoomPosition, rcl: number, locate = true): Array<PlannedStructure> => {

  let starterPos: RoomPosition
  if (typeof flag == 'string') {
    flag = Game.flags[flag]
  }

  if (flag instanceof RoomObject) {
    starterPos = flag.pos
  } else if (flag instanceof RoomPosition) {
    starterPos = flag
  } else {
    return [];
  }

  let x = starterPos.x;
  let y = starterPos.y;
  let CTs: PlannedStructure[] = [];

  let towerX = x;
  let towerY = y + 4;

  let sth = locate ? locateSomething_byAux(starterPos.roomName, starterPos) : null;

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

      if (locate && sth) {
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

      if (locate && sth) {

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

      if (locate && sth) {

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

      if (locate && sth) {

        //* source的container
        //* controller的container
        CTs = CTs.concat(sth.containerPos_sources, sth.containerPos_controller)

      }

      break;
    case 1:
      return CTs;

  }

  //这里别sort

  return CTs;




}


/**
 * 
 * @param {Flag} flag 
 * @param {Number} rcl 
 */
const placeCT = (flag: Flag, rcl: number) => {

  if (Game.time % INTERVAL_PLACE_CONSTRUCTION_SITES != 0) {
    return
  }
  if (!flag.room) {
    return;
  }

  let terrain = new Room.Terrain(flag.pos.roomName)  // 防止建到墙上 //TODO 中心位置仍依赖于手动观察
  let CTs = CTinfos(flag, rcl)
  const priority = ['tower', 'extension', 'container', 'link', 'storage', 'observer', 'powerSpawn', 'extractor', 'lab', 'terminal', 'nuker', 'spawn', 'road']
  CTs = CTs.sort((a, b) => priority.indexOf(a.type) - priority.indexOf(b.type))
  // console.log('CTs: ', CTs);
  for (let s of CTs) {
    if (!(s && s.x && s.y && s.type)) {
      continue
    }
    if (s.type == STRUCTURE_SPAWN) {
      continue
    }
    if (terrain.get(s.x, s.y) === TERRAIN_MASK_WALL) {
      continue
    }

    let { x, y, type } = s
    if (flag.room.createConstructionSite(x, y, type) === ERR_FULL) {
      break;
    }
  }

}


/**
 * 根据flag位置自动摆放建筑
 * @param {Flag|String} flag 
 */
const developNewRoom = (flag: Flag | string) => {

  //* 默认此时已建好spawn，根据flag的位置和rcl自动摆放建筑

  if (typeof flag == 'string') {
    flag = Game.flags[flag]
  }

  if (!flag) {
    return
  }

  let room = Game.rooms[flag.pos.roomName]
  if (!room.controller?.my) {
    return
  }

  // keepCreeps(targetRoom)

  let rcl = room.controller.level

  if (!room.cts || !room.cts.length) {
    placeCT(flag, rcl)
  }


}


export default developNewRoom