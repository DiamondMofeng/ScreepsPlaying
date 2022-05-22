/**
 * 
 * @param {Number} x1 
 * @param {Number} y1 
 * @param {Number} x2 
 * @param {Number} y2 
 * @returns 
 */
const getRectangleArea = (x1, y1, x2, y2) => {
  if (x1 > x2) return getRectangleArea(x2, y1, x1, y2);
  if (y1 > y2) return getRectangleArea(x1, y2, x2, y1);

  let res = []
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
 * @returns 
 */
const getCenterSquare = (x, y, range) => {
  let x1 = x - range
  let y1 = y - range
  let x2 = x + range
  let y2 = y + range
  return getRectangleArea(x1, y1, x2, y2)
}


const avoidSourceKeeper = (roomName) => {

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

      getCenterSquare(x, y, 3).forEach(pos => {
        costs.set(pos.x, pos.y, 50)
      })

    }
  }

  return costs


}


module.exports = {
  avoidSourceKeeper
}