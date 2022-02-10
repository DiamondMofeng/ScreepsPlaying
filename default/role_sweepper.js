const Carrier = require('./role_carrier')
const { targetsPriorizer_byRef, recycleSelf, transferAllToStorage } = require('./util_beheavor')


var roleSweeper = {

  /** @param {Creep} creep **/
  run: function (creep) {

    // if (creep.memory.manual == true) {
    //   if (Game.flags.sweepper) {
    //     creep.moveTo(Game.flags.sweepper)
    //   }
    // }



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


      //! start to work
      if (droppedResources.length) {

        if (creep.store.getFreeCapacity() != 0) {


          // console.log(creep.store.getFreeCapacity())

          let resourcePriorizer = targetsPriorizer_byRef('resourceType', RESOURCES_ALL.reverse(), false)
          let priorizedResource = resourcePriorizer(droppedResources)
          console.log('priorizedResource: ', priorizedResource);


          if (creep.pickup(priorizedResource) == ERR_NOT_IN_RANGE) {
            // console.log('creep.pickup(priorizedResource): ', creep.pickup(priorizedResource));
            creep.moveTo(priorizedResource, { visualizePathStyle: { stroke: '#ffaa00' } })
            return
          }

          //if 
        } else {
          // console.log('123')
          transferAllToStorage(creep)
        }
      }

      //! pick TOMB 's resources


      if (tombsHaveResource.length) {

        if (creep.store.getFreeCapacity() !== 0) {

          let tomb0 = tombsHaveResource[0]
          // console.log(creep.store.getFreeCapacity())

          let resourcePriorizer = targetsPriorizer_byRef('resourceType', RESOURCES_ALL.reverse(), false)

          let resourcesTypesInTomb = Object.keys(tomb0.store)
          // console.log('resourcesTypesInTomb: ', resourcesTypesInTomb);

          let priorizedResource = resourcePriorizer(resourcesTypesInTomb)

          // console.log('priorizedResource: ', priorizedResource);


          for (rt in resourcesTypesInTomb) {

            // console.log('tomb0: ', tomb0);
            if (creep.withdraw(tomb0, priorizedResource) == ERR_NOT_IN_RANGE) {

              // console.log('creep.withdraw(tomb0, priorizedResource): ', creep.withdraw(tomb0, priorizedResource));

              creep.moveTo(priorizedResource, { visualizePathStyle: { stroke: '#ffaa00' } })
              return
            }

          }

          //if 
        } else {
          // console.log('123')
          transferAllToStorage(creep)
        }

        //after pickup

      }


      // //if dont have work,

    } else {
      if (creep.store.getUsedCapacity() > 0) {
        transferAllToStorage(creep)
      }

      // //start to countdown
      // else if (creep.memory.recycleCountdown > 0) {
      //   creep.memory.recycleCountdown -= 1
      // }

      //* 转变为carrier
      else if (creep.store.getUsedCapacity() == 0) {
        // creep.memory.role = 'carrier'
        Carrier(creep)
      }
    }
  }
};

module.exports = roleSweeper.run;