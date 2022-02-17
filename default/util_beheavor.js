
/**
 * 从最近的有充足能量的Container中取走能量
 * @param {Creep} creep 
 * @param {Object} opt 
 * @opt {Number} minCap
 * @opt {Array} blackList - 包括不想拿走能量的container ID string
 * @returns {boolean} 是否找到了合适的container
 */
const getEnergyFromContainer = (creep, opt = {}) => {
  // console.log('opt: ', JSON.stringify(opt));

  let min = 200
  let BL = []
  if (!_.isUndefined(opt.min)) {
    min = opt.min
  }
  if (!_.isUndefined(opt.blackList)) {


    BL = opt.blackList
    // console.log('BL: ', BL);
  }
  // console.log('opt.blackList: ', opt.blackList);

  const findContainer = (creep) => {
    return creep.room.find(FIND_STRUCTURES, {
      filter: (s) => {
        // console.log('structure.id: ', structure.id);
        // console.log('BL.indexOf(structure.id) == -1: ', BL.indexOf(structure.id) == -1);
        if (s.structureType == STRUCTURE_CONTAINER
          && s.store.getUsedCapacity(RESOURCE_ENERGY) > min
          && BL.indexOf(s.id) == -1) {
          // console.log('BL: ', BL);
          // console.log('s.id: ', s.id);

          return true
        }

      }
    })
  }

  const container = creep.pos.findClosestByPath(findContainer(creep))
  if (container) {
    if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      creep.moveTo(container, { ...opt, visualizePathStyle: { stroke: '#ffaa00' } });
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

  const findStorage = (creep) => {
    return creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return structure.structureType == STRUCTURE_STORAGE && structure.store.getUsedCapacity(RESOURCE_ENERGY) > minCap;
      }
    })
  }

  const storage = creep.pos.findClosestByPath(findStorage(creep))
  if (storage) {
    if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      creep.moveTo(storage, { ...opt, visualizePathStyle: { stroke: '#ffaa00' } });
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

  if (spawnName == '') {
    let spawns = creep.room.find(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_SPAWN })
    nearest = creep.pos.findClosestByPath(spawns)
  } else {
    nearest = Game.spawns[spawnName]
  }


  console.log(`${creep} is going to recycle at ${nearest}`)

  let result = nearest.recycleCreep(creep)
  if (result == ERR_NOT_IN_RANGE) {
    creep.moveTo(nearest)
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
 * 包括墓碑中的能量
 * @param {Creep} creep 
 * @param {number} range 
 * @returns {boolean} true if have energy to pick
 */
function pickUpNearbyDroppedEnergy(creep, range = 1) {
  if (creep.store.getFreeCapacity() != 0) {
    let droppedEnergys = creep.pos.findInRange(FIND_DROPPED_RESOURCES, range, { filter: r => r.resourceType == RESOURCE_ENERGY })
    let tombsHaveEnergy = creep.pos.findInRange(FIND_TOMBSTONES, range, { filter: t => t.store.energy > 0 })
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

    return founded

  }
}

/**
 * 默认只取能量
 * @param {Creep} creep 
 * @param {StructureContainer|STRUCTURE_STORAGE} container - withdraw from
 * @param {Array} resourceTypes an array
 */
function moveAndWithdraw(creep, container, resourceTypes = [RESOURCE_ENERGY]) {
  for (rt of resourceTypes) {

    let withdrawResult = creep.withdraw(container, rt)
    // console.log('withdrawResult', rt, withdrawResult)
    // console.log('Game.cpu.getUsed(): ', Game.cpu.getUsed());

    if (withdrawResult == ERR_NOT_IN_RANGE) {
      creep.moveTo(container, { reusePath: 50 })
      return
    }

    // console.log('Game.cpu.getUsed(): ', Game.cpu.getUsed());

  }
}


/**
 * 将creep身上的资源转移至指定container
 * @param {Creep} creep 
 * @param {StructureContainer|STRUCTURE_STORAGE} container - transfer to
 * @param {Array} resourceTypes - 未指定时转移所有资源
 * 
 */
function moveAndTransfer(creep, container, resourceTypes = []) {

  if (resourceTypes.length > 0) {

    for (rt of resourceTypes) {
      if (creep.transfer(container, rt) == ERR_NOT_IN_RANGE) {
        creep.moveTo(container, { reusePath: 50 })
        return
      }
    }

  } else {

    for (rt in creep.store) {

      let transferResult = creep.transfer(container, rt)

      // console.log(transferResult)

      if (transferResult == ERR_NOT_IN_RANGE) {
        creep.moveTo(container)
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
function moveToRoom(creep, roomName, oneStep = false) {
  if (creep.room.name !== roomName) {
    creep.moveTo(new RoomPosition(25, 25, roomName))
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
  }
}
//5bbcac3c9099fc012e635232
//5bbcac3c9099fc012e635233


module.exports = {
  getEnergyFromContainer, getEnergyFromStorage,
  PriorizedTarget, targetsPriorizer_byRef,
  recycleSelf,
  transferAllToStorage,
  pickUpNearbyDroppedEnergy,
  moveAndWithdraw, moveAndTransfer,
  setDoing,
  repireNearbyRoad,
  moveToRoom

}