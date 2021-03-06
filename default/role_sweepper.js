const Carrier = require('./role_carrier')
const { targetsPriorizer_byRef, recycleSelf, transferAllToStorage, setDoing } = require('./util_beheavor')


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



          let resourcePriorizer = targetsPriorizer_byRef('resourceType', [...RESOURCES_ALL].reverse(), false)
          let priorizedResource = resourcePriorizer(droppedResources)


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

          let tomb0 = tombsHaveResource[0]

          let resourcePriorizer = targetsPriorizer_byRef('resourceType', [...RESOURCES_ALL].reverse(), false)

          let resourcesTypesInTomb = Object.keys(tomb0.store)

          let priorizedResource = resourcePriorizer(resourcesTypesInTomb)


          for (rt in resourcesTypesInTomb) {

            if (creep.withdraw(tomb0, priorizedResource) == ERR_NOT_IN_RANGE) {


              creep.moveTo(tomb0, { visualizePathStyle: { stroke: '#ffaa00' } })

            }
            return
          }

          //if 
        } else {
          transferAllToStorage(creep)
        }

        //after pickup

      }


      // //if dont have work,

    }
    else {



      //* ??????????????????????????????????????????

      //! ???Object.keys(store).length?????????store.length
      let storeTypes = Object.keys(creep.store)
      if (storeTypes.length >= 2 || (storeTypes.length == 1 && creep.store[RESOURCE_ENERGY] == 0)) {



        setDoing(creep, 'sweepper_transferAllToStorage')
        transferAllToStorage(creep)



      }

      // //start to countdown
      // else if (creep.memory.recycleCountdown > 0) {
      //   creep.memory.recycleCountdown -= 1
      // }

      //* ?????????carrier
      else {
        setDoing(creep, 'sweepper_carrier')

        // creep.memory.role = 'carrier'
        Carrier(creep)
      }


    }
  }
};

module.exports = roleSweeper.run;