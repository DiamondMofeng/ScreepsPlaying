
/**
 * 从最近的有充足能量的Container中取走能量
 * @param {*} creep 
 * @returns {boolean} 是否找到了合适的container
 */
const getEnergyFromContainer = (creep, minCap = 200, opt = {}) => {

  const findContainer = (creep) => {
    return creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return structure.structureType == STRUCTURE_CONTAINER && structure.store.getUsedCapacity(RESOURCE_ENERGY) > minCap;
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
 * 
 * @param {Array} targets - Array of targets
 * @returns {Function} targets处理函数，以targets为参数，递归处理targets
 */
const targetsPriorizer_byRef = (priorRef, priorArray) => {

  const processTargets = (targets, _priorArray = priorArray) => {

    if (!_priorArray.length) { return targets[0] }

    const curType = _priorArray.shift()

    const result = _.filter(targets, t => t[priorRef] == curType)
    return result.length
      ? result[0]
      : processTargets(targets, _priorArray)
  }

  return processTargets
}


/**
 * 找到最近的spawn进行回收
 * @param {*} creep 
 */
function recycleSelf(creep) {
  console.log(`${creep} is going to recycle`)
  let spawns = creep.room.find(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_SPAWN })
  let nearest = creep.pos.findClosestByPath(spawns)
  console.log('nearest', nearest)

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
    console.log(creep.store)
    let result = creep.transfer(storage, rt)

    if (result = ERR_NOT_IN_RANGE) {
      creep.moveTo(storage)
      return
    }
  }

}


/**
 * 
 * @param {Creep} creep 
 * @param {number} range 
 * @returns {boolean} true if have energy to pick
 */
function pickUpNearbyDroppedEnergy(creep, range = 2) {
  let nearbyDroppedEnergys = creep.pos.findInRange(FIND_DROPPED_RESOURCES, range, { filter: r => r.resourceType == RESOURCE_ENERGY })
  if (nearbyDroppedEnergys.length > 0) {

    if (creep.pickup(nearbyDroppedEnergys[0]) == ERR_NOT_IN_RANGE) {
      creep.moveTo(nearbyDroppedEnergys[0])
    }

    return true

  } else return false
}




//5bbcac3c9099fc012e635232
//5bbcac3c9099fc012e635233


module.exports = {
  getEnergyFromContainer, getEnergyFromStorage,
  PriorizedTarget, targetsPriorizer_byRef,
  recycleSelf,
  transferAllToStorage,
  pickUpNearbyDroppedEnergy
}