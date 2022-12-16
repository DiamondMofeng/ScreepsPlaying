import Carrier from './role_carrier';
import { transferAllToStorage, setDoing, prioritySelect } from './util_beheavor';


var roleSweeper = {

  /** @param {Creep} creep **/
  run: function (creep) {





    if (creep.memory.manual == true) {
      if (Game.flags.sweepper) {
        creep.moveTo(Game.flags.sweepper)
      }
    }



    // if (_.isUndefined(creep.memory.recycleCountdown)) {
    //   creep.memory.recycleCountdown = 50
    // } else if (creep.memory.recycleCountdown == 0) {
    //   recycleSelf(creep)
    // }


    let droppedResources = creep.room.find(FIND_DROPPED_RESOURCES)
    let tombsHaveResource = creep.room.find(FIND_TOMBSTONES, { filter: t => t.store.getUsedCapacity() > 0 })




    if (creep.store.getFreeCapacity() != 0
      && (droppedResources.length > 0 || tombsHaveResource.length > 0)
    ) {

      setDoing(creep, 'sweepper_sweepping')

      //! start to work
      if (droppedResources.length) {

        if (creep.store.getFreeCapacity() != 0) {


          //TODO use cache
          let priorizedResource = prioritySelect(droppedResources, [...RESOURCES_ALL].reverse(), res => res.resourceType, false)

          if (creep.pickup(priorizedResource) == ERR_NOT_IN_RANGE) {
            creep.moveTo(priorizedResource, { visualizePathStyle: { stroke: '#ffaa00' } })

          }
          return
        } else {
          transferAllToStorage(creep)
        }
      }

      //! pick TOMB 's resources


      if (tombsHaveResource.length) {

        if (creep.store.getFreeCapacity() !== 0) {

          const tomb0 = tombsHaveResource[0]

          //TODO use cahce

          const prioritizedResourceType = prioritySelect(Object.keys(tomb0.store), [...RESOURCES_ALL].reverse())

          if (creep.withdraw(tomb0, prioritizedResourceType) == ERR_NOT_IN_RANGE) {

            creep.moveTo(tomb0, { visualizePathStyle: { stroke: '#ffaa00' } })

          }

        } else {
          transferAllToStorage(creep)
        }

        //after pickup

      }


      // //if dont have work,

    }
    else {



      //* 若身上有除了能量以外别的资源

      //! 用Object.keys(store).length而不是store.length
      let storeTypes = Object.keys(creep.store)
      if (storeTypes.length >= 2 || (storeTypes.length == 1 && creep.store[RESOURCE_ENERGY] == 0)) {



        setDoing(creep, 'sweepper_transferAllToStorage')
        transferAllToStorage(creep)



      }

      // //start to countdown
      // else if (creep.memory.recycleCountdown > 0) {
      //   creep.memory.recycleCountdown -= 1
      // }

      //* 转变为carrier
      else {
        setDoing(creep, 'sweepper_carrier')

        // creep.memory.role = 'carrier'
        Carrier(creep)
      }


    }
  }
};

export default roleSweeper.run;