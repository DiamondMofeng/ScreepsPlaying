

const { body } = require("./util_helper")
//withRoad
//withBoost
let min
const evalBody_harvester = (spawnName, opt = {}) => {

  let room = Game.spawns[spawnName].room
  let curEnergy = room.energyAvailable
  let capEnergy = room.energyCapacityAvailable

  let haveRoad = opt.haveRoad || false

  let minBody = { w: 1, c: 1, m: 1 }
  let maxBody = { w: 7, c: 1, m: 1 }

  let w = (curEnergy - 100) / 100
  if (w >= 1) {
    if (w > 7) { w = 7 }

    return body([WORK, w, CARRY, 1, MOVE, 1])
  }

}

const evalBody_worker_halfEnergy = (spawnName, opt = {}) => {
  let room = Game.spawns[spawnName].room
  let curEnergy = room.energyAvailable
  let capEnergy = room.energyCapacityAvailable

  let haveRoad = opt.haveRoad || false

  //搭配:1w1c1m = 200
  let i = curEnergy / 200 / 2
  return body([WORK, i, CARRY, i, MOVE, i])
}

module.exports = { evalBody_harvester, evalBody_worker_halfEnergy }