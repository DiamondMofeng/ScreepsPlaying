const { IGNORE_CREEPS } = require("./util_consts")


/**
 * 从最近的有充足能量的Container中取走能量
 * @param {Creep} creep 
 * @param {Object} opt 
 * @opt {Number} min
 * @opt {Array} BL - 包括不想拿走能量的container ID string
 * @returns {boolean} 是否找到了合适的container
 */
const getEnergyFromContainer = (creep, opt = {}) => {
  // console.log('opt: ', JSON.stringify(opt));

  let min = opt.min || 200
  let BL = opt.BL || []
  let range = opt.range || false
  let moveOpt = opt.moveOpt || {}
  let ignoreController = opt.ignoreController || false
  let container;

  if (range == false) {

    const findContainer = (creep) => {
      return creep.room.find(FIND_STRUCTURES, {
        filter: (s) => {
          // console.log('structure.id: ', structure.id);
          // console.log('BL.indexOf(structure.id) == -1: ', BL.indexOf(structure.id) == -1);
          if (s.structureType == STRUCTURE_CONTAINER
            && s.store.getUsedCapacity(RESOURCE_ENERGY) > min
            && BL.indexOf(s.id) == -1) {

            if (ignoreController && s.type == 'controller') {
              return false;
            }

            return true
          }

        }
      })

    }
    container = creep.pos.findClosestByPath(findContainer(creep))
  }
  else {
    let find = creep.pos.findInRange(FIND_STRUCTURES, range, { filter: s => s.structureType == STRUCTURE_CONTAINER })
    container = find.length > 0 ? find[0] : undefined
  }

  if (container) {
    // console.log(creep, container)
    let witRes = creep.withdraw(container, RESOURCE_ENERGY)
    if (witRes == ERR_NOT_IN_RANGE) {
      let movRes = creep.moveTo(container, { ...moveOpt, visualizePathStyle: { stroke: '#ffaa00' } });
      // console.log('movRes: ', movRes);
    }
    return true
  }
  else return false
}

/**
 * 从最近的有充足能量的Storage中取走能量
 * @param {*} creep 
 * @returns {boolean} 是否找到了合适的storage
 */
const getEnergyFromStorage = (creep, minCap = 5000, opt = {}) => {
  let moveOpt = opt.moveOpt || {}

  const storage = creep.room.storage
  if (!_.isUndefined(storage) && storage.store.getUsedCapacity(RESOURCE_ENERGY) > minCap) {
    if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      creep.moveTo(storage, { ...moveOpt, visualizePathStyle: { stroke: '#ffaa00' } });
    }
    return true
  }
  else return false
}

const getEnergyFromTerminal = (creep, minCap = 5000, opt = {}) => {
  let moveOpt = opt.moveOpt || {}

  const terminal = creep.room.terminal
  if (!_.isUndefined(terminal) && terminal.store.getUsedCapacity(RESOURCE_ENERGY) > minCap) {
    if (creep.withdraw(terminal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      creep.moveTo(terminal, { ...moveOpt, visualizePathStyle: { stroke: '#ffaa00' } });
    }
    return true
  }
  else return false
}

/**
 * 从最近的有充足能量的Link中取走能量
 * @param {Creep} creep 
 * @param {Object} opt
 * @option {Number} range - 搜索范围，默认2
 * @option {Number} minCap - Link最低具有多少能量，默认0
 * @returns {boolean} 是否找到了合适的link
 */
const getEnergyFromNearbyLink = (creep, opt = {}) => {
  let range = opt.range || 2
  let minCap = opt.minCap || 0
  const findLink = (creep) => {
    return creep.pos.findInRange(FIND_STRUCTURES, range, {
      filter: (structure) => {
        return structure.structureType == STRUCTURE_LINK && structure.store.getUsedCapacity(RESOURCE_ENERGY) > minCap;
      }
    })
  }

  const link = findLink(creep)[0]

  if (link) {

    if (creep.withdraw(link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {

      creep.moveTo(link, { visualizePathStyle: { stroke: '#ffaa00' } });

    }
    return true
  }
  else return false
}



/**
 * 用于建筑：从targets中按照priorArray的顺序返回最优先项</br>
 * 调用方法：PriorizedTarget(targets)(priorArray)
 * @param {[]} targets 
 * @param {[]} priorArray
 * @returns 
 */
const PriorizedTarget = (targets) => {

  // console.log('ts:' + transTargets)
  // const priorArray = [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER, STRUCTURE_CONTAINER]

  //1. input targets to get a func needs priorArray

  const getPriority = (priorArray) => {

    const curType = priorArray.shift()

    const result = _.filter(targets, t => t.structureType == curType)
    return result.length
      ? result[0]
      : getPriority(priorArray)

  }

  return getPriority
}




/**
 * 
 * @param {string} priorRef - 用于 filter: t[priorRef] in targets == priorArray[i] 的t属性
 * @param {Array} priorArray - 按优先顺序排列的t.priorRef属性数组
 * @param {boolean} returnArray - 是否返回数组，默认true
 * 
 * @param {Array} targets - Array of targets
 * @returns {Function} targets处理函数，以targets为参数，递归处理targets
 */
const targetsPriorizer_byRef = (priorRef, priorArray, returnArray = true) => {


  const processTargets = (targets, _priorArray = priorArray) => {

    if (!_priorArray.length) { return targets[0] }

    const curType = _priorArray.shift()

    const result = _.filter(targets, t => t[priorRef] == curType)
    return result.length
      ? returnArray
        ? result : result[0]
      : processTargets(targets, _priorArray)
  }

  return processTargets
}







/**
 * 找到最近的spawn进行回收
 * @param {*} creep 
 */
function recycleSelf(creep, spawnName = '') {

  let nearest

  if (creep.memory.spawnName) {
    nearest = Game.spawns[creep.memory.spawnName]
  }

  else if (spawnName == '') {
    let spawns = creep.room.find(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_SPAWN })
    nearest = creep.pos.findClosestByPath(spawns)
  }
  else {
    nearest = Game.spawns[spawnName]
  }


  console.log(`${creep} is going to recycle at ${nearest}`)

  let result = nearest.recycleCreep(creep)
  if (result == ERR_NOT_IN_RANGE) {
    creep.moveTo(nearest, { reusePath: 50 })
  }

}

/**
 * 将身上所有资源送至storage
 * @param {Creep} creep 
 * @param {StructureStorage} certainStorage 
 */
function transferAllToStorage(creep, certainStorage = null) {
  let storage = certainStorage ? certainStorage : creep.room.storage


  for (let rt in creep.store) {

    let result = creep.transfer(storage, rt)

    if (result = ERR_NOT_IN_RANGE) {
      creep.moveTo(storage)
      return
    }
  }

}


/**
 * 拾取range内掉落的能量
 * 包括墓碑、ruin中的能量
 * @param {Creep} creep 
 * @param {number} range - 默认为1
 * @returns {boolean} true if have energy to pick
 */
function pickUpNearbyDroppedEnergy(creep, range = 1) {
  if (creep.store.getFreeCapacity() != 0) {
    let droppedEnergys = creep.pos.findInRange(FIND_DROPPED_RESOURCES, range, { filter: r => r.resourceType == RESOURCE_ENERGY })
    let tombsHaveEnergy = creep.pos.findInRange(FIND_TOMBSTONES, range, { filter: t => t.store.energy > 0 })
    let ruinsHaveEnergy = creep.pos.findInRange(FIND_RUINS, range, { filter: t => t.store.energy > 0 })

    let founded = false
    // console.log('picking')

    if (droppedEnergys.length > 0) {
      if (creep.pickup(droppedEnergys[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(droppedEnergys[0])
      }
      founded = true
    }

    if (tombsHaveEnergy.length > 0) {
      if (creep.withdraw(tombsHaveEnergy[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(tombsHaveEnergy[0])
      }
      founded = true
    }

    if (ruinsHaveEnergy.length > 0) {
      if (creep.withdraw(ruinsHaveEnergy[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(ruinsHaveEnergy[0])
      }
      founded = true
    }

    return founded

  }
}

/**
 * 默认只取能量
 * @param {Creep} creep 
 * @param {StructureContainer|STRUCTURE_STORAGE} container - withdraw from
 * @param {Array} resourceTypes an array
 */
function moveAndWithdraw(creep, container, resourceTypes = [RESOURCE_ENERGY], amount) {
  for (rt of resourceTypes) {

    var withdrawResult = creep.withdraw(container, rt, amount)
    // console.log('withdrawResult', rt, withdrawResult)

    if (withdrawResult == ERR_NOT_IN_RANGE) {
      creep.moveTo(container, { reusePath: 50, ignoreCreeps: IGNORE_CREEPS })
      return withdrawResult
    }


  }
  return withdrawResult
}


/**
 * 输入creep和mineral对象
 * @param {Creep} creep 
 * @param {Source|Mineral|Deposit} target - 采集的对象
 */
function moveAndHarvest(creep, target) {

  let harvestResult = creep.harvest(target)
  // console.log('withdrawResult', rt, withdrawResult)
  // console.log('Game.cpu.getUsed(): ', Game.cpu.getUsed());

  if (harvestResult == ERR_NOT_IN_RANGE) {
    creep.moveTo(target, { reusePath: 50, ignoreCreeps: IGNORE_CREEPS })
    return
  }

}


/**
 * 将creep身上的资源转移至指定container，未指定时转移所有资源
 * @param {Creep} creep 
 * @param {StructureContainer|StructureStore} container - transfer to
 * @param {Array} resourceTypes - 未指定时转移所有资源
 * 
 */
function moveAndTransfer(creep, container, resourceTypes = []) {

  let moveResult
  let transferResult

  //若给定类型了则按类型transfer
  if (resourceTypes.length > 0) {

    for (rt of resourceTypes) {
      if (creep.transfer(container, rt) == ERR_NOT_IN_RANGE) {
        creep.moveTo(container, { reusePath: 50, ignoreCreeps: IGNORE_CREEPS })
        return
      }
    }

  } else {

    for (rt in creep.store) {

      let transferResult = creep.transfer(container, rt)

      // console.log(transferResult)

      if (transferResult == ERR_NOT_IN_RANGE) {
        creep.moveTo(container, { reusePath: 50, ignoreCreeps: IGNORE_CREEPS })
        return
      }
    }
  }
}



/**
 * 赋予creep工作状态属性: 以确保 收集能量至满背包，工作至能量清空
 * @notice 不需要给这两个函数传参数
 * @param {Creep} creep 
 * @param {Function} onCharge - 收集能量时的脚本函数
 * @param {Function} onWork  - 工作时的脚本函数
 */
function workingStatesKeeper(creep, onCharge, onWork) {

  //若能量为空，置为获取能量状态
  if (creep.store.getUsedCapacity() == 0) {
    creep.memory.working = false
  }

  //若能量为满，置为工作状态
  if (creep.store.getFreeCapacity() == 0) {
    creep.memory.working = true
  }


  //开始收集能量
  if (creep.memory.working == false) {
    onCharge()
  }

  else {
    onWork()
  }
}

/**
 * 
 * @param {Creep} creep 
 * @param {String} doing 
 */
function setDoing(creep, doing) {
  creep.memory.doing = doing
}

/**
 * 修理creep旁边的任意建筑
 * @param {Creep} creep 
 * @param {Number} range - 修的范围 默认2
 * @param {Number} ratio - 开始修的比例 默认0.8
 */
function repireNearbyRoad(creep, range = 2, ratio = 0.8) {

  let roadsToRepair = creep.pos.findInRange(FIND_STRUCTURES, range, { filter: s => s.structureType == STRUCTURE_ROAD && s.hits / s.hitsMax < ratio })
  if (roadsToRepair.length > 0) {
    creep.repair(roadsToRepair[0])
  }
}

/**
 * 在无视野的情况下前往指定房间
 * @param {Creep} creep
 * @param {String} roomName - 要去的房间名称 
 * @param {Boolean} oneStep - 进入房间后是否往前走一步避免卡在房间出口，默认false
 */
function moveToRoom(creep, roomName, oneStep = false, safe = false) {


  // let cost = null
  // if (safe) {
  //   cost = function (roomName)
  // }

  if (creep.room.name !== roomName) {
    let moveRes = creep.moveTo(new RoomPosition(25, 25, roomName))
    // console.log(creep, 'moveRes: ', moveRes);
    return false;
  }
  else if (oneStep === true) {
    if (_.isUndefined(creep.memory.oneStep)) {
      creep.memory.oneStep = false
    }

    if (creep.memory.oneStep == false) {
      let moveResult = creep.moveTo(new RoomPosition(25, 25, roomName))
      if (moveResult == 0) {
        creep.memory.oneStep = true
      }
    }

    return true;
  }
}
//5bbcac3c9099fc012e635232
//5bbcac3c9099fc012e635233


/**
 * 从房间内的resource,tomb,ruin获取能量
 * 极度消耗CPU
 * @param {Creep} creep 
 * @param {Number} range - 捡破烂的距离，默认为5
 */
function getEnergyFromWasted(creep, range = 5) {
  if (creep.store.getFreeCapacity() != 0) {

    let founded = false

    let droppedEnergys = creep.pos.findInRange(FIND_DROPPED_RESOURCES, range, { filter: r => r.resourceType == RESOURCE_ENERGY })
    if (droppedEnergys.length > 0) {
      if (creep.pickup(droppedEnergys[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(droppedEnergys[0])
      }
      founded = true
      return founded
    }

    let tombsHaveEnergy = creep.pos.findInRange(FIND_TOMBSTONES, range, { filter: t => t.store.energy > 0 })
    if (tombsHaveEnergy.length > 0) {
      if (creep.withdraw(tombsHaveEnergy[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(tombsHaveEnergy[0])
      }
      founded = true
      return founded

    }

    let ruinsHaveEnergy = creep.pos.findInRange(FIND_RUINS, range, { filter: t => t.store.energy > 0 })
    if (ruinsHaveEnergy.length > 0) {
      if (creep.withdraw(ruinsHaveEnergy[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(ruinsHaveEnergy[0])
      }
      founded = true
      return founded

    }

    return founded

  }
}


/**
 * FIND有能源的Source并过去挖
 * @param {Creep} creep 
 */
function getEnergyFromHarvest(creep) {
  let activeSources = creep.room.find(FIND_SOURCES_ACTIVE)
  if (activeSources.length > 0) {
    if (creep.harvest(activeSources[0]) == ERR_NOT_IN_RANGE) {
      creep.moveTo(activeSources[0])
    }
    return true;
  }
  else return false
}

/**
 * 在Creep房间中尽一切办法尝试获取能量
 * 注意！很耗CPU
 * @param {Creep} creep 
 * @param {Array} ignore - 不想要获取能源的方法
 * @ignore wasted,container,terminal,storage,harvest
 */
function tryCollectAnyEnergy(creep, ignore = []) {

  if (getEnergyFromWasted(creep)) return
  if (getEnergyFromContainer(creep)) return
  if (getEnergyFromTerminal(creep)) return
  if (getEnergyFromStorage(creep)) return
  if (getEnergyFromHarvest(creep)) return

}




module.exports = {
  getEnergyFromContainer, getEnergyFromStorage, getEnergyFromNearbyLink,
  getEnergyFromTerminal, getEnergyFromWasted, getEnergyFromHarvest,
  tryCollectAnyEnergy,

  targetsPriorizer_byRef,
  recycleSelf,
  transferAllToStorage,
  pickUpNearbyDroppedEnergy,
  moveAndWithdraw, moveAndTransfer, moveAndHarvest,
  setDoing,
  repireNearbyRoad,
  moveToRoom,
  workingStatesKeeper

}