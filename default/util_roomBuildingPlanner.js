const C = require("./util_consts")

/**
 * 
 * @param {RoomVisual} v
 * @param {number} x 
 * @param {number} y 
 */
const drawExtension = (v, x, y) => {

}












const DrawBuildings = (V, x, y) => {

  // let x=x;
  // let y=y;


  let spawnPos = [
    { x: x, y: y - 3 },
    { x: x, y: y - 4 },
    { x: x, y: y - 5 },
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
    { x: x, y: y }
  ]

  let labPos = [
    { x: x + 3, y: y + 3 },
    { x: x + 3, y: y + 4 },

    { x: x + 4, y: y + 2 },
    { x: x + 4, y: y + 4 },
    { x: x + 4, y: y + 5 },

    { x: x + 5, y: y + 2 },
    { x: x + 5, y: y + 3 },
    { x: x + 5, y: y + 5 },

    { x: x + 6, y: y + 3 },
    { x: x + 6, y: y + 4 },


  ]

  let storagePos = [
    { x: x - 1, y: y }  //左
  ]
  let factoryPos = [
    { x: x + 1, y: y }  //右
  ]
  let terminalPos = [
    { x: x, y: y + 1 }  //下
  ]

  let towerX = x;
  let towerY = y + 4;
  let towerPos = [
    { x: towerX - 1, y: towerY - 1 }, //1
    { x: towerX - 1, y: towerY },     //2
    { x: towerX - 1, y: towerY + 1 }, //3
    { x: towerX + 1, y: towerY - 1 },
    { x: towerX + 1, y: towerY },
    { x: towerX + 1, y: towerY + 1 }, //6
  ]
  let containerPos = [

  ]

  for (pos of extensionPos) {
    V.text('ⓔ', pos.x, pos.y, { color: '#f5b400' })
  }
  for (pos of linkPos) {
    V.text('◊', pos.x, pos.y, { color: '#f5b400' })
  }
  for (pos of spawnPos) {
    V.text('Ⓢ', pos.x, pos.y, { color: '#0f9d58' })
  }
  for (pos of containerPos) {
    V.text('▯', pos.x, pos.y, { color: '#f5b400' })
  }
  for (pos of labPos) {
    V.text('💡', pos.x, pos.y, { opacity: 0.5 })
  }
  for (pos of storagePos) {
    V.text('💾', pos.x, pos.y, {})
  }
  for (pos of factoryPos) {
    V.text('🏭', pos.x, pos.y, {})
  }
  for (pos of terminalPos) {
    V.text('💰', pos.x, pos.y, {})
  }
  // for (pos of roadPos) {
  //   V.text('▨', pos.x, pos.y, {})
  // }
  for (pos of towerPos) {
    V.text('♜', pos.x, pos.y, {})
  }
}



/**
 * 
 * @param {String|Flag} flag 
 * @returns 
 */
const roomBuildingPlanner = (flag) => {
  if (typeof flag === 'string') {
    flag = Game.flags[flag];
  }
  if (!flag) return;

  // if (!flag.room) return;

  // let V = new RoomVisual(flag.room.name);
  let V = new RoomVisual();

  DrawBuildings(V, flag.pos.x, flag.pos.y)

  //* 基地plan





}







module.exports = roomBuildingPlanner;
