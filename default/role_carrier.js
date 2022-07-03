const Upgrader = require('./role_upgrader')
const { getEnergyFromContainer, getEnergyFromStorage, pickUpNearbyDroppedEnergy, targetsPriorizer_byRef, getEnergyFromTerminal, targetsPriorizer_structureType } = require('./util_beheavor')
const { IGNORE_CREEPS } = require('./util_consts')


const MIN_ENERGY = {
  [STRUCTURE_POWER_SPAWN]: 3000,
  [STRUCTURE_TOWER]: 900,
  [STRUCTURE_LAB]: 1000,
  [STRUCTURE_STORAGE]: 1000,
  [STRUCTURE_CONTAINER]: 1500,
  // [STRUCTURE_LINK]: 1000,
  // [STRUCTURE_TERMINAL]: 1000,
  [STRUCTURE_NUKER]: 300000,

}

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

    let targets = creep.room.find(FIND_STRUCTURES, {
      filter: (s) => {
        return (

          ((
            s.structureType == STRUCTURE_EXTENSION
            || s.structureType == STRUCTURE_SPAWN
          ) && (s.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
          )
          || (s.structureType == STRUCTURE_CONTAINER
            && s.store.getUsedCapacity(RESOURCE_ENERGY) < MIN_ENERGY[STRUCTURE_CONTAINER]
            && s.type == 'controller'
          )
          || (s.structureType == STRUCTURE_STORAGE
            && s.store.getUsedCapacity(RESOURCE_ENERGY) < 1000000
          )
          || (s.structureType == STRUCTURE_TOWER
            && s.store.getUsedCapacity(RESOURCE_ENERGY) < MIN_ENERGY[STRUCTURE_TOWER]
          )
          || (s.structureType == STRUCTURE_LAB
            && s.store.getUsedCapacity(RESOURCE_ENERGY) < MIN_ENERGY[STRUCTURE_LAB]
          )
          || (s.structureType == STRUCTURE_TERMINAL
            && s.store.getUsedCapacity(RESOURCE_ENERGY) < 300 * 1000
          )
          || (s.structureType == STRUCTURE_NUKER
            && s.store.getUsedCapacity(RESOURCE_ENERGY) < MIN_ENERGY[STRUCTURE_NUKER]
          )
          || (s.structureType == STRUCTURE_POWER_SPAWN
            && s.store.getUsedCapacity(RESOURCE_ENERGY) < MIN_ENERGY[STRUCTURE_POWER_SPAWN]
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

        // pickUpNearbyDroppedEnergy(creep)

        if (getEnergyFromContainer(creep, { min: 300, ignoreController: true })) {
          return
        } else if (getEnergyFromStorage(creep, 0)) {
          return
        } else if (getEnergyFromTerminal(creep, 0)) {
          return
        }






        // // ! 转变为sweepper
      }


      // }




      else {
        // const priorTargets = targetsPriorizer_byRef('structureType'
        //   , [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER, STRUCTURE_LAB, STRUCTURE_POWER_SPAWN, STRUCTURE_CONTAINER, STRUCTURE_NUKER, STRUCTURE_STORAGE, STRUCTURE_TERMINAL])(targets)
        const priorTargets = targetsPriorizer_structureType(targets, [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER, STRUCTURE_LAB, STRUCTURE_POWER_SPAWN, STRUCTURE_CONTAINER, STRUCTURE_NUKER, STRUCTURE_STORAGE, STRUCTURE_TERMINAL]);
        if (priorTargets.length) {

          // if (creep.name == 'carrier_W11N8_37208296') {
          //   console.log(priorTargets)
          // }

          let closest = creep.pos.findClosestByRange(priorTargets, { ignoreCreeps: true })
          if (closest && closest.id && closest.structureType) {
            creep.memory.target = { id: closest.id, structureType: closest.structureType }

          }
          // console.log('CarrierTarget' + priorTarget)

          if (creep.transfer(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            let moveRes = creep.moveTo(closest, { ignoreCreeps: IGNORE_CREEPS, visualizePathStyle: { visualizePathStyle: { stroke: '#FFFF00' } } });
            // console.log('moveRes: ', moveRes);

          }

          // if (haveJob)
        }

      }
    }



    // else {

  }

}

module.exports = roleCarrier.run;


