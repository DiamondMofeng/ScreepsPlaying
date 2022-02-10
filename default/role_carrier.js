const Upgrader = require('./role_upgrader')
const { getEnergyFromContainer, getEnergyFromStorage, pickUpNearbyDroppedEnergy, targetsPriorizer_byRef } = require('./util_beheavor')



// const PriorizedTarget = (targets) => {
//   // console.log("t1:", targets)  
//   if (!targets.length) return (any) => null
//   const getPriority = (priorArray) => {

//     const curType = priorArray.shift()
//     const result = _.filter(targets, t => t.structureType == curType)
//     return result.length
//       ? result[0]
//       : getPriority(priorArray)

//   }

//   return getPriority
// }

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
          || (structure.structureType == STRUCTURE_STORAGE
            && structure.store.getUsedCapacity(RESOURCE_ENERGY) < 50000

          )
          || (structure.structureType == STRUCTURE_TOWER
            && structure.store.getUsedCapacity(RESOURCE_ENERGY) < 750
          )
        )
      }
    });

    const haveJob = () => {
      if (targets.length > 0) {
        return true
      }
      else return false
    }


    //! //////////main//////////
    if (!haveJob()) {
      // console.log('carrier dont have job,turn into Upgrader')
      Upgrader(creep)

    }
    else {
      // console.log("here")
      if (creep.store.getUsedCapacity() == 0) {

        //the later has higher priority

        getEnergyFromStorage(creep, 10000)

        getEnergyFromContainer(creep, 1400)

        pickUpNearbyDroppedEnergy(creep, 2)


        // // ! 转变为sweepper
      }


      // }




      else {
        const priorTargets = targetsPriorizer_byRef('structureType'
          , [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER, STRUCTURE_CONTAINER, STRUCTURE_STORAGE])(targets)
        if (priorTargets.length) {

          let closest = creep.pos.findClosestByPath(priorTargets)
          // console.log('CarrierTarget' + priorTarget)

          if (creep.transfer(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(closest, { visualizePathStyle: { visualizePathStyle: { stroke: '#FFFF00' } } });
          }

          // if (haveJob)
        }

      }
    }



    // else {

  }

}

module.exports = roleCarrier.run;


