import { workingStatesKeeper, tryCollectAnyEnergy } from './util_beheavor'

/**
 * 
 * @param {Creep} creep 
 */
const roleStarter = function (creep) {


  //仅进行upgrade

  workingStatesKeeper(creep,
    () => {
      tryCollectAnyEnergy(creep)
    },
    () => {
      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller)
      }
    })
}


export default roleStarter


