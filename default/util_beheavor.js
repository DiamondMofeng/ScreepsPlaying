const getEnergyFromContainer = (creep) => {

  const findContainer = (creep) => {
    return creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return structure.structureType == STRUCTURE_CONTAINER && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 100;
      }
    })
  }

  const container = findContainer(creep)[0]
  if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    creep.moveTo(container, { visualizePathStyle: { stroke: '#ffaa00' } });
  }
}



const PriorizedTransTarget = (transTargets) => {
  console.log(transTargets)
  for (t in transTargets) {
    console.log(t)
    console.log(t.structureType)

    switch (t.structureType) {
      case STRUCTURE_SPAWN:
        return t
      case STRUCTURE_EXTENSION:
        return t
      case STRUCTURE_TOWER:
        return t
      case STRUCTURE_CONTAINER:
        return t
      default:
        return t
    }
  }
}

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
