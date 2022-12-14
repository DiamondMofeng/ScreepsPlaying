

const { body } = require("./util_helper")
//withRoad
//withBoost
let min

const evalBody_harvester = (roomName, opt = {}) => {
  let room = Game.rooms[roomName]
  let curEnergy = room.energyAvailable
  let capEnergy = room.energyCapacityAvailable

  let haveRoad = opt.haveRoad || false

  let minBody = { w: 1, c: 1, m: 1 }
  let maxBody = { w: 10, c: 2, m: 1 }

  //TODO 比较拖慢效率，待优化
  if (room.controller.isPowerEnabled == true) {
    let pcs = room.find(FIND_POWER_CREEPS).find(pc => pc.powers[PWR_REGEN_SOURCE] != undefined)
    if (pcs) {
      let pwrLevel = pcs.powers[PWR_REGEN_SOURCE].level
      maxBody.w = Math.ceil(maxBody.w + (pwrLevel * 1.6))
    }
  }

  maxBody.m = Math.ceil((maxBody.w + maxBody.c) / 2)

  let w = Math.floor((curEnergy - 100) / 100)
  if (w > maxBody.w) {
    w = maxBody.w
  }

  let m = Math.floor((curEnergy - 50 - 100 * w) / 50)
  if (m < 0) {
    m = 1
  } else if (m >= maxBody.m) {
    m = maxBody.m
  }

  //TODO use _.clamp

  return body([
    WORK, Math.max(w, minBody.w),
    CARRY, 1,
    MOVE, Math.max(m, minBody.m),
  ])

}

/**
 * 
 * @param {*} roomName 
 * @param {*} opt 
 * @opt haveRoad - 默认为true,若为false则move=2*(w+c)
 * @returns 
 */
const evalBody_worker_halfEnergy = (roomName, opt = {}) => {
  let room = Game.rooms[roomName]
  let curEnergy = room.energyAvailable
  let capEnergy = room.energyCapacityAvailable

  let haveRoad = opt.haveRoad || true

  let i;
  if (!haveRoad) {
    i = curEnergy / 250 / 2
    if (i < 1) { i = 1 }
    if (i * 4 > 50) { i = 50 / 4 }

    return body([WORK, i, CARRY, i, MOVE, 2 * i])

  } else {
    i = curEnergy / 200 / 2 //1w1c1m = 200
    if (i < 1) { i = 1 }
    if (i * 3 > 50) { i = 50 / 3 }
    return body([WORK, i, CARRY, i, MOVE, i])

  }
}

const evalBody_worker_fullEnergy = (roomName, opt = {}) => {
  let room = Game.rooms[roomName]
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

const evalBody_carrier_halfEnergy = (roomName, opt = {}) => {
  let room = Game.rooms[roomName]
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


/**
 * 
 * @param {String} roomName 
 * @param {String} role 
 * @param {Object|SpawnOptions} opt 
 */
const evalBodyByRole = (roomName, role, opt = {}) => {

  //* 因为role名是role+房间名，所以没法直接用switch
  // switch (role) {
  //   case 'harvester_plus':
  //     return evalBody_harvester(spawnName, opt)
  //   case 'worker':
  //     return evalBody_worker_halfEnergy(spawnName, opt)
  //   // case 'worker_fullEnergy':
  //   //   return evalBody_worker_fullEnergy(spawnName, opt)
  //   case 'carrier':
  //     return evalBody_carrier_halfEnergy(spawnName, opt)
  //   default:
  //     return []
  // }

  if (role.startsWith('harvesterPlus')) {
    return evalBody_harvester(roomName, opt)
  }

  else if (role.startsWith('worker')) {
    return evalBody_worker_halfEnergy(roomName, opt)
  }

  else if (role.startsWith('builder')) {
    return evalBody_worker_halfEnergy(roomName, opt)
  }

  else if (role.startsWith('upgrader')) {
    return evalBody_worker_halfEnergy(roomName, opt)
  }
  else if (role.startsWith('miner')) {
    return evalBody_worker_fullEnergy(roomName, opt)
  }

  else if (role.startsWith('carrier')) {
    return evalBody_carrier_halfEnergy(roomName, opt)
  }
  else if (role.startsWith('base_transferor')) {
    return evalBody_carrier_halfEnergy(roomName, opt)
  }

  else {
    return []
  }
}
module.exports = {
  evalBodyByRole,
  evalBody_harvester, evalBody_worker_halfEnergy, evalBody_carrier_halfEnergy, evalBody_worker_fullEnergy
}