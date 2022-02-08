const Harvester = require('./role_harvester')
const HarvesterPlus = require('./role_harvesterPlus')
const Carrier = require('./role_carrier')
const Upgrader = require('./role_upgrader')
// const Upgrader = require('./role_upgraderPlus')
const Builder = require('./role_builder')
const Repairer = require('./role_repairer')
const Sweepper = require('./role_sweepper')


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
  }
  // console.log('1')
}

module.exports = controller_creeps;

