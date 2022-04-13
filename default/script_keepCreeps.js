/**
 * 保持creep数量。
 * !临时用
 * 
 */

const { evalBody_worker_halfEnergy, evalBody_harvester, evalBody_carrier_halfEnergy, evalBody_worker_fullEnergy } = require("./spawn_evalBody")
const C = require("./util_consts")
const { spawnByMinNumber, body } = require("./util_helper")

/**
 * 
 * @param {String} targetRoom 
 * @param {Object} opt 
 * @returns 
 */
const keepCreeps = (targetRoom, opt = {}) => {

  //* 默认此时已建好spawn，根据flag的位置和rcl自动摆放建筑、生产creep


  let room = Game.rooms[targetRoom]
  if (!room) {
    return
  }

  let spawnName = targetRoom + '_0'  //TODO 到时候用生产队列代替
  if (!Game.spawns[spawnName]) {
    return
  }

  let rcl = Game.rooms[targetRoom].controller.level
  switch (rcl) {
    case 1:
      spawnByMinNumber(spawnName, 'upgrader_' + targetRoom, [WORK, MOVE, CARRY, MOVE], 3)

      break;
    case 2:

      spawnByMinNumber(spawnName, 'upgrader_' + targetRoom, evalBody_worker_halfEnergy(spawnName, { haveRoad: false }), 5)
      spawnByMinNumber(spawnName, 'harvesterPlus_' + targetRoom, evalBody_harvester(spawnName), 2)
      spawnByMinNumber(spawnName, 'carrier_' + targetRoom, evalBody_carrier_halfEnergy(spawnName), 2)

      if (room.cts && room.cts.length > 0) {
        spawnByMinNumber(spawnName, 'builder_' + targetRoom, evalBody_worker_halfEnergy(spawnName, { haveRoad: false }), 1)
      }



      break;
    case 3:

      spawnByMinNumber(spawnName, 'upgrader_' + targetRoom, evalBody_worker_halfEnergy(spawnName), 5)
      spawnByMinNumber(spawnName, 'harvesterPlus_' + targetRoom, evalBody_harvester(spawnName), 2)
      spawnByMinNumber(spawnName, 'carrier_' + targetRoom, evalBody_carrier_halfEnergy(spawnName), 2)

      if (room.cts && room.cts.length > 0) {
        spawnByMinNumber(spawnName, 'builder_' + targetRoom, evalBody_worker_halfEnergy(spawnName), 2)
      }


      break;
    case 4:





      spawnByMinNumber(spawnName, 'upgrader_' + targetRoom, evalBody_worker_halfEnergy(spawnName), 4)

      spawnByMinNumber(spawnName, 'carrier_' + targetRoom, evalBody_carrier_halfEnergy(spawnName), 2)

      spawnByMinNumber(spawnName, 'harvesterPlus_' + targetRoom, evalBody_harvester(spawnName), 2)

      if (room.cts && room.cts.length > 0) {
        spawnByMinNumber(spawnName, 'builder_' + targetRoom, evalBody_worker_halfEnergy(spawnName), 2)
      }



      break;
    case 5:

      spawnByMinNumber(spawnName, 'upgrader_' + targetRoom, evalBody_worker_halfEnergy(spawnName), 4)

      spawnByMinNumber(spawnName, 'harvesterPlus_' + targetRoom, evalBody_harvester(spawnName), 2)

      spawnByMinNumber(spawnName, 'carrier_' + targetRoom, evalBody_carrier_halfEnergy(spawnName), 2)



      if (room.cts && room.cts.length > 0) {
        spawnByMinNumber(spawnName, 'builder_' + targetRoom, evalBody_worker_halfEnergy(spawnName), 2)
      }


      break;
    case 6:
      spawnByMinNumber(spawnName, 'upgrader_' + targetRoom, evalBody_worker_halfEnergy(spawnName), 4)

      spawnByMinNumber(spawnName, 'harvesterPlus_' + targetRoom, evalBody_harvester(spawnName), 2)

      spawnByMinNumber(spawnName, 'carrier_' + targetRoom, evalBody_carrier_halfEnergy(spawnName), 2)

      spawnByMinNumber(spawnName, 'base_transferor_' + targetRoom, evalBody_carrier_halfEnergy(spawnName), 1)

      if (room.mineral.mineralAmount > 0) {
        spawnByMinNumber(spawnName, 'miner_' + targetRoom, evalBody_worker_halfEnergy(spawnName), 1)
      }

      if (room.cts && room.cts.length > 0) {
        spawnByMinNumber(spawnName, 'builder_' + targetRoom, evalBody_worker_halfEnergy(spawnName), 2)
      }


      break;
    case 7:
      spawnByMinNumber(spawnName, 'upgrader_' + targetRoom, body([WORK, 15, CARRY, 2, MOVE, 6]), 1)
      spawnByMinNumber(spawnName, 'harvesterPlus_' + targetRoom, evalBody_harvester(spawnName), 2)
      spawnByMinNumber(spawnName, 'carrier_' + targetRoom, evalBody_carrier_halfEnergy(spawnName), 1)
      spawnByMinNumber(spawnName, 'base_transferor_' + targetRoom, evalBody_carrier_halfEnergy(spawnName), 1)

      if (room.mineral.mineralAmount > 0) {
        spawnByMinNumber(spawnName, 'miner_' + targetRoom, evalBody_worker_halfEnergy(spawnName), 1)
      }

      if (room.cts && room.cts.length > 0) {
        spawnByMinNumber(spawnName, 'builder_' + targetRoom, evalBody_worker_halfEnergy(spawnName), 2)
      }
      break;
    case 8:
      spawnByMinNumber(spawnName, 'upgrader_' + targetRoom, body([WORK, 1, CARRY, 1, MOVE, 1]), 1)
      spawnByMinNumber(spawnName, 'harvesterPlus_' + targetRoom, evalBody_harvester(spawnName), 2)
      spawnByMinNumber(spawnName, 'carrier_' + targetRoom, evalBody_carrier_halfEnergy(spawnName), 1)
      spawnByMinNumber(spawnName, 'base_transferor_' + targetRoom, evalBody_carrier_halfEnergy(spawnName), 1)
      if (room.mineral.mineralAmount > 0) {
        spawnByMinNumber(spawnName, 'miner_' + targetRoom, evalBody_worker_halfEnergy(spawnName), 1)
      }

      if (room.cts && room.cts.length > 0) {
        spawnByMinNumber(spawnName, 'builder_' + targetRoom, evalBody_worker_halfEnergy(spawnName), 2)
      }


      break;
  }
}

module.exports = keepCreeps