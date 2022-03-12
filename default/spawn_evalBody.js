

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

  let w = Math.floor((curEnergy - 100) / 100)
  let m = Math.floor((curEnergy - 50 - 100 * w) / 50)

  if (w >= 1) {
    if (w >= 7) {
      w = 7
    }
    if (m < 0) {
      m = 1
    } else if (m >= 4) {
      m = 4
    }

    return body([WORK, w, CARRY, 1, MOVE, m])
  }
  else {
    // console.log(`${spawnName}'s energy 不足以产生 harvesterplus`)
    return []
  }

}

/**
 * 
 * @param {*} spawnName 
 * @param {*} opt 
 * @opt haveRoad - 默认为true,若为false则move=2*(w+c)
 * @returns 
 */
const evalBody_worker_halfEnergy = (spawnName, opt = {}) => {
  let room = Game.spawns[spawnName].room
  let curEnergy = room.energyAvailable
  let capEnergy = room.energyCapacityAvailable

  let haveRoad = opt.haveRoad || true

  let i;
  if (haveRoad) {
    i = curEnergy / 250 / 2
    return body([WORK, i, CARRY, i, MOVE, 2 * i])

  } else {
    i = curEnergy / 200 / 2 //1w1c1m = 200
    return body([WORK, i, CARRY, i, MOVE, i])

  }
}

module.exports = { evalBody_harvester, evalBody_worker_halfEnergy }