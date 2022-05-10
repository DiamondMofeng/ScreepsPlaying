const Tower = require('./building_tower')
const Link = require('./building_link')
const Factory = require('./building_factory')
const PowerSpawn = require('./building_powerSpawn')


function controller_buildings() {

  for (s of Object.values(Game.structures)) {

    try {
      if (s.structureType == STRUCTURE_TOWER) {
        Tower(s)
      }
      if (s.structureType == STRUCTURE_LINK) {
        Link(s)
      }
      // if (s.structureType == STRUCTURE_TERMINAL) {
      //   Terminnal(s)
      // }
      if (s.structureType == STRUCTURE_FACTORY) {
        Factory(s)
      }
      // if (s.structureType == STRUCTURE_TOWER) {
      //   Tower(s)
      // }
      if (s.structureType == STRUCTURE_POWER_SPAWN) {
        PowerSpawn(s)
      }
    }
    catch (e) {
      console.log('!!!!!!!!!!!!ERROR FOUND IN ' + s + ' CONTROLL!!!!!!!!!' + e)

    }

  }
}

module.exports = controller_buildings;

