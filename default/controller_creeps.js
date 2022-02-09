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



function controller_creeps() {
  //beheavor crontroller
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





    ////////LONG/////////
    if (creep.memory.role == 'long_pionner') {
      long_Pionner(creep, 'out')
    }

    if (creep.memory.role == 'long_reserver') {
      long_Reserver(creep, 'out')
    }
  }
  // console.log('1')
}

module.exports = controller_creeps;

