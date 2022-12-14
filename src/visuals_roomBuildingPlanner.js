// const C = require("./util_consts")

// /**
//  * 
//  * @param {RoomVisual} v
//  * @param {number} x 
//  * @param {number} y 
//  */
// const drawExtension = (v, x, y) => {

// }


const DrawBuildings = (V, x, y) => {

  // let x=x;
  // let y=y;


  let spawnPos = [
    { x: x, y: y - 3 }, //1
    { x: x, y: y - 4 }, //2 at 7
    { x: x, y: y - 5 }, //3 at 8
  ]

  let extensionPos = [
    { x: x - 6, y: y - 5 },
    { x: x - 6, y: y - 4 },
    { x: x - 6, y: y - 3 },
    { x: x - 6, y: y - 2 },
    { x: x - 6, y: y - 1 }, //5
    { x: x - 6, y: y + 5 },
    { x: x - 6, y: y + 4 },
    { x: x - 6, y: y + 3 },
    { x: x - 6, y: y + 2 },
    { x: x - 6, y: y + 1 }, //10

    { x: x - 5, y: y - 5 },
    { x: x - 5, y: y - 3 },
    { x: x - 5, y: y - 1 },
    { x: x - 5, y: y + 5 },
    { x: x - 5, y: y + 3 },
    { x: x - 5, y: y + 1 },

    { x: x - 4, y: y - 5 },
    { x: x - 4, y: y - 4 },
    { x: x - 4, y: y - 2 },
    { x: x - 4, y: y - 1 }, //20
    { x: x - 4, y: y + 5 },
    { x: x - 4, y: y + 4 },
    { x: x - 4, y: y + 2 },
    { x: x - 4, y: y + 1 },

    { x: x - 3, y: y - 5 },
    { x: x - 3, y: y - 3 },
    { x: x - 3, y: y - 1 },
    { x: x - 3, y: y + 5 },
    { x: x - 3, y: y + 3 },
    { x: x - 3, y: y + 1 }, //30

    { x: x - 2, y: y - 5 },
    { x: x - 2, y: y - 4 },
    { x: x - 2, y: y - 3 },
    { x: x - 2, y: y - 2 },
    { x: x - 2, y: y + 5 },
    { x: x - 2, y: y + 4 },
    { x: x - 2, y: y + 3 },
    { x: x - 2, y: y + 2 },
    ////
    { x: x + 6, y: y - 5 },
    { x: x + 6, y: y - 4 }, //40
    { x: x + 6, y: y - 3 },
    { x: x + 6, y: y - 2 },
    { x: x + 6, y: y - 1 },

    { x: x + 5, y: y - 5 },
    { x: x + 5, y: y - 3 },
    { x: x + 5, y: y - 1 },

    { x: x + 4, y: y - 5 },
    { x: x + 4, y: y - 4 },
    { x: x + 4, y: y - 2 },
    { x: x + 4, y: y - 1 }, //50

    { x: x + 3, y: y - 5 },
    { x: x + 3, y: y - 3 },
    { x: x + 3, y: y - 1 },

    { x: x + 2, y: y - 5 },
    { x: x + 2, y: y - 4 },
    { x: x + 2, y: y - 3 },
    { x: x + 2, y: y - 2 }, //57

  ]

  let linkPos = [
    { x: x, y: y - 1 }
  ]

  let labPos = [
    { type: STRUCTURE_LAB, x: x + 3, y: y + 3 },
    { type: STRUCTURE_LAB, x: x + 3, y: y + 4 },

    { type: STRUCTURE_LAB, x: x + 4, y: y + 2 },  //3
    { type: STRUCTURE_LAB, x: x + 4, y: y + 4 },
    { type: STRUCTURE_LAB, x: x + 4, y: y + 5 },

    { type: STRUCTURE_LAB, x: x + 5, y: y + 2 },  //6
    { type: STRUCTURE_LAB, x: x + 5, y: y + 3 },
    { type: STRUCTURE_LAB, x: x + 5, y: y + 5 },

    { type: STRUCTURE_LAB, x: x + 6, y: y + 3 },
    { type: STRUCTURE_LAB, x: x + 6, y: y + 4 },  //10


  ]

  let storagePos = [
    { x: x - 1, y: y }  //左
  ]
  let factoryPos = [
    { type: STRUCTURE_FACTORY, x: x + 1, y: y }  //右
  ]
  let terminalPos = [
    { type: STRUCTURE_TERMINAL, x: x, y: y + 1 }  //下
  ]

  let towerX = x;
  let towerY = y + 4;
  let towerPos = [
    { type: STRUCTURE_TOWER, x: towerX - 1, y: towerY - 1 }, //1 at 3
    { type: STRUCTURE_TOWER, x: towerX - 1, y: towerY },     //2 at 5
    { type: STRUCTURE_TOWER, x: towerX - 1, y: towerY + 1 }, //3 at 7
    { type: STRUCTURE_TOWER, x: towerX + 1, y: towerY - 1 },
    { type: STRUCTURE_TOWER, x: towerX + 1, y: towerY },
    { type: STRUCTURE_TOWER, x: towerX + 1, y: towerY + 1 }, //6 at 8
  ]
  let containerPos = [

  ]

  let powerSpawnPos = [
    { type: STRUCTURE_POWER_SPAWN, x: x + 3, y: y + 1 },

  ]

  let observerPos = [
    { type: STRUCTURE_OBSERVER, x: x + 5, y: y + 1 },

  ]

  let nukerPos = [
    { type: STRUCTURE_NUKER, x: x + 4, y: y + 1 },

  ]



  for (const pos of extensionPos) {
    V.text('ⓔ', pos.x, pos.y, { color: '#f5b400' })
  }
  for (const pos of linkPos) {
    V.text('◊', pos.x, pos.y, { color: '#f5b400' })
  }
  for (const pos of spawnPos) {
    V.text('Ⓢ', pos.x, pos.y, { color: '#0f9d58' })
  }
  for (const pos of containerPos) {
    V.text('▯', pos.x, pos.y, { color: '#f5b400' })
  }
  for (const pos of labPos) {
    V.text('💡', pos.x, pos.y, { opacity: 0.5 })
  }
  for (const pos of storagePos) {
    V.text('💾', pos.x, pos.y, {})
  }
  for (const pos of factoryPos) {
    V.text('🏭', pos.x, pos.y, {})
  }
  for (const pos of terminalPos) {
    V.text('💰', pos.x, pos.y, {})
  }
  // for (const pos of roadPos) {
  //   V.text('▨', pos.x, pos.y, {})
  // }
  for (const pos of towerPos) {
    V.text('♜', pos.x, pos.y, {})
  }
  for (const pos of nukerPos) {
    V.text('🚀', pos.x, pos.y, { opacity: 0.5 })
  }
  for (const pos of powerSpawnPos) {
    V.text('Ⓢ', pos.x, pos.y, { color: '#f03333' })
  }
  for (const pos of observerPos) {
    V.text('📡', pos.x, pos.y, { opacity: 0.5 })
  }
}



/**
 * 以指定旗帜为中心，显示城市布局。
 * @param {String|Flag} flag 
 * @returns 
 */
const roomBuildingPlanner = (flag) => {
  if (typeof flag === 'string') {
    flag = Game.flags[flag];
  }
  if (!flag) return;

  let V = new RoomVisual(flag.pos.roomName);

  DrawBuildings(V, flag.pos.x, flag.pos.y)

  //* 基地plan


}







module.exports = roomBuildingPlanner;
