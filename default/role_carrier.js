const Upgrader = require('./role_upgrader')
const { getEnergyFromContainer } = require('./util_beheavor')



const PriorizedTarget = (targets) => {
  // console.log("t1:", targets)  
  if (!targets.length) return (any) => null
  const getPriority = (priorArray) => {

    const curType = priorArray.shift()
    const result = _.filter(targets, t => t.structureType == curType)
    return result.length
      ? result[0]
      : getPriority(priorArray)

  }

  return getPriority
}

var roleCarrier = {
  /** @param {Creep} creep **/
  run: function (creep) {
    let targets = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (
          ((
            structure.structureType == STRUCTURE_EXTENSION
            || structure.structureType == STRUCTURE_SPAWN
          ) && (structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
          )
          || (structure.structureType == STRUCTURE_CONTAINER
            && structure.store.getUsedCapacity(RESOURCE_ENERGY) < 1000
          )
          || (structure.structureType == STRUCTURE_TOWER
            && structure.store.getUsedCapacity(RESOURCE_ENERGY) < 800
          )
        )
      }
    });
    // console.log("targets.length", targets.length)
    // console.log(typeof targets)

    const haveJob = () => {
      // console.log("targets1", targets)
      // console.log("targets.length", targets.length)
      if (targets.length > 0) {
        // console.log('return true')
        return true
      }
      else return false
    }
    // console.log(haveJob())
    // console.log("targets2", targets)


    ////////////main//////////
    if (!haveJob()) {
      // console.log('carrier dont have job,turn into Upgrader')
      Upgrader(creep)

    }
    else {
      // console.log("here")
      if (creep.store.getUsedCapacity() == 0) {
        getEnergyFromContainer(creep, 1500)
      }
      else {
        const priorTarget = PriorizedTarget(targets)([STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER, STRUCTURE_CONTAINER])
        if (priorTarget) {

          console.log('CarrierTarget' + priorTarget)

          if (creep.transfer(priorTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(priorTarget, { visualizePathStyle: { stroke: '#ffffff' } });
          }

          // if (haveJob)
        }
      }
    }



    // else {

  }

}

module.exports = roleCarrier.run;


