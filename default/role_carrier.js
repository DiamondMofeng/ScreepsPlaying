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

    //! HARD CODED!!!!!!

    let blackList = ['61ff6d41e69b53cf867c9aac', '61feb366182cf40dfd2b848a']
    let targets = creep.room.find(FIND_STRUCTURES, {
      filter: (s) => {
        return (
          (blackList.indexOf(s.id) == -1)
          && (
            ((
              s.structureType == STRUCTURE_EXTENSION
              || s.structureType == STRUCTURE_SPAWN
            ) && (s.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
            )
            || (s.structureType == STRUCTURE_CONTAINER
              && s.store.getUsedCapacity(RESOURCE_ENERGY) < 1500

            )
            || (s.structureType == STRUCTURE_STORAGE
              && s.store.getUsedCapacity(RESOURCE_ENERGY) < 1000000

            )
            || (s.structureType == STRUCTURE_TOWER
              && s.store.getUsedCapacity(RESOURCE_ENERGY) < 900
            )
            || (s.structureType == STRUCTURE_LAB
              && s.store.getUsedCapacity(RESOURCE_ENERGY) < 2000
            )
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
      // Upgrader(creep)

    }
    else {
      // console.log("here")
      if (creep.store.getUsedCapacity() == 0) {

        //the later has higher priority
        pickUpNearbyDroppedEnergy(creep)

        if (getEnergyFromContainer(creep, { min: 300, blackList: ['620b405774b79b735e8dcaa4'] })) {
          return
        } else if (getEnergyFromStorage(creep, 0)) {
          return
        }






        // // ! 转变为sweepper
      }


      // }




      else {
        const priorTargets = targetsPriorizer_byRef('structureType'
          , [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER, STRUCTURE_LAB, STRUCTURE_CONTAINER, STRUCTURE_STORAGE])(targets)
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


