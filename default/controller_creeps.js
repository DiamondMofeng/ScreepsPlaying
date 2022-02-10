const Harvester = require('./role_harvester')
const HarvesterPlus = require('./role_harvesterPlus')
const Carrier = require('./role_carrier')
const Upgrader = require('./role_upgrader')
// const Upgrader = require('./role_upgraderPlus')
const Builder = require('./role_builder')
const Repairer = require('./role_repairer')
const Sweepper = require('./role_sweepper')

const long_Pionner = require('./role_long_pioneer')
const long_Reserver = require('./role_long_reserver')
const long_Carrier = require('./role_long_carrier')
const long_Harvester = require('./role_long_harvester')

const base_Transferor = require('./role_base_transferor')

const Useless = require('./role_useless')


function controller_creeps() {

  //* beheavor crontroller
  for (creepName in Game.creeps) {
    var creep = Game.creeps[creepName]
    if (creep.memory.role == 'harvester') {
      //  Builder(creep)
      Harvester(creep)
    }
    if (creep.memory.role == 'harvesterPlus') {
      HarvesterPlus(creep)
    }
    if (creep.memory.role == 'carrier') {
      //   Harvester(creep)
      Carrier(creep)
    }
    if (creep.memory.role == 'builder') {
      Builder(creep)
    }
    if (creep.memory.role == 'upgrader') {
      Upgrader(creep)
      // Builder(creep)
    }
    if (creep.memory.role == 'repairer') {
      Repairer(creep)
      // Builder(creep)
      // Harvester(creep)
    }
    if (creep.memory.role == 'sweepper') {
      Sweepper(creep)
    }





    //! //////LONG/////////
    if (creep.memory.role == 'long_pionner') {
      long_Pionner(creep, 'out')
    }

    if (creep.memory.role == 'long_reserver') {
      long_Reserver(creep, 'out')
    }

    if (creep.memory.role == 'long_carrier') {
      // long_Carrier(creep, Game.getObjectById('6200bf0e9b3fe1ad6927628f'), Game.getObjectById('6200bf0e9b3fe1ad6927628f'))
      long_Carrier(creep, Game.getObjectById('6204d67b3a03e2154eb99bde'), Game.getObjectById('6200bf0e9b3fe1ad6927628f')) // normal

    }

    if (creep.memory.role == 'long_harvester') {
      // console.log('Game.getObjectById(): ', Game.getObjectById('5bbcac4a9099fc012e6353bc'));
      long_Harvester(creep
        , Game.getObjectById('6204d67b3a03e2154eb99bde')//container
        , Game.getObjectById('5bbcac4a9099fc012e6353bc')//source

      )
    }

    //! BASE//////////////

    if (creep.memory.role == 'base_transferor') {
      // console.log('Game.getObjectById(): ', Game.getObjectById('5bbcac4a9099fc012e6353bc'));
      base_Transferor(creep
        , Game.getObjectById('62041ae6638cf54110e7422d')//link - storage
        , Game.getObjectById('62043cc4d55ca519e1a7db68')//storage

      )
    }

    //! ///////////other////////////
    if (creep.memory.role == 'useless') {
      Useless(creep)
    }
  }


  // console.log('1')
}

module.exports = controller_creeps;

