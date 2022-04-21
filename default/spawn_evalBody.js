

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
  if (w >= 7) {
    w = 7
  }

  let m = Math.floor((curEnergy - 50 - 100 * w) / 50)
  if (m < 0) {
    m = 1
  } else if (m >= 4) {
    m = 4
  }

  if (w >= 1) {


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
  if (!haveRoad) {
    i = curEnergy / 250 / 2
    if (i * 4 > 50) { i = 50 / 4 }

    return body([WORK, i, CARRY, i, MOVE, 2 * i])

  } else {
    i = curEnergy / 200 / 2 //1w1c1m = 200
    if (i * 3 > 50) { i = 50 / 3 }
    return body([WORK, i, CARRY, i, MOVE, i])

  }
}

const evalBody_worker_fullEnergy = (spawnName, opt = {}) => {
  let room = Game.spawns[spawnName].room
  let curEnergy = room.energyAvailable
  let capEnergy = room.energyCapacityAvailable

  let haveRoad = opt.haveRoad || true

  let i;
  if (!haveRoad) {
    i = curEnergy / 250
    return body([WORK, i, CARRY, i, MOVE, 2 * i])

  } else {
    i = curEnergy / 200   //1w1c1m = 200
    return body([WORK, i, CARRY, i, MOVE, i])

  }
}

const evalBody_carrier_halfEnergy = (spawnName, opt = {}) => {
  let room = Game.spawns[spawnName].room
  let curEnergy = room.energyAvailable
  let capEnergy = room.energyCapacityAvailable

  let haveRoad = opt.haveRoad || false

  let i;
  if (haveRoad) {
    i = curEnergy / 150 / 2
    if (i > 50 / 3) {
      i = 50 / 3
    }
    return body([CARRY, i, MOVE, 2 * i])

  } else {
    i = curEnergy / 100 / 2 //1w1c1m = 200
    if (i > 50 / 2) {
      i = 50 / 2
    }
    return body([CARRY, i, MOVE, i])

  }
}

module.exports = { evalBody_harvester, evalBody_worker_halfEnergy, evalBody_carrier_halfEnergy, evalBody_worker_fullEnergy }