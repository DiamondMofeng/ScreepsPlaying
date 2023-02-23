type Coord2D = [number, number]

export const getRectangleArea = (x1: number, y1: number, x2: number, y2: number): Coord2D[] => {
  if (x1 > x2) return getRectangleArea(x2, y1, x1, y2);
  if (y1 > y2) return getRectangleArea(x1, y2, x2, y1);

  let res: Coord2D[] = []
  while (x1 <= x2) {
    while (y1 <= y2) {
      res.push([x1, y1])
      y1 += 1
    }
    x1 += 1
  }
  return res
}

/**
 * 
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} range 
 */
const getCenterSquare = (x: number, y: number, range: number): Coord2D[] => {
  let x1 = x - range
  let y1 = y - range
  let x2 = x + range
  let y2 = y + range
  return getRectangleArea(x1, y1, x2, y2)
}

const getBorder = (x1: number, y1: number, x2: number, y2: number): Coord2D[] => {
  if (x1 > x2) {
    return getBorder(x2, y1, x1, y2)
  }
  if (y1 > y2) {
    return getBorder(x1, y2, x2, y1)
  }

  let res: Coord2D[] = []
  for (let x = x1; x <= x2; x++) {
    res.push([x, y1])
    res.push([x, y2])
  }
  for (let y = y1 + 1; y <= y2 - 1; y++) {
    res.push([x1, y])
    res.push([x2, y])
  }
  return res
}


export const avoidSourceKeeper = (roomName: string) => {

  let room = Game.rooms[roomName]

  if (!room) {
    return
  }

  let costs = new PathFinder.CostMatrix()


  let hostileCreeps = room.find(FIND_HOSTILE_CREEPS)

  //周围3格增加成本
  if (hostileCreeps.length > 0) {
    for (let enemy of hostileCreeps) {

      let { x, y } = enemy.pos

      getCenterSquare(x, y, 3).forEach(([xx, yy]) => {
        costs.set(xx, yy, 50)
      })

    }
  }

  return costs


}

const roomBorder = getBorder(0, 0, 49, 49);

// const stayInRoomCostMatrix = (function () {
//   let costs = new PathFinder.CostMatrix()
//   for (let [x, y] of roomBorder) {
//     costs.set(x, y, 0xff)
//   }
//   return costs
// })()

export const stayInRoomCallBack = (roomName: string, costMatrix: CostMatrix) => {
  for (let [x, y] of roomBorder) {
    costMatrix.set(x, y, 0xff)
  }
}
