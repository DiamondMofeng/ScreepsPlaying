/**
 * 从最近的有充足能量的Container中取走能量
 * @param {*} creep 
 * @returns {boolean} 是否找到了合适的container
 */
const getEnergyFromContainer = (creep, minCap = 200) => {

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
      creep.moveTo(container, { visualizePathStyle: { stroke: '#ffaa00' } });
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


//5bbcac3c9099fc012e635232
//5bbcac3c9099fc012e635233


module.exports = { getEnergyFromContainer, PriorizedTarget }