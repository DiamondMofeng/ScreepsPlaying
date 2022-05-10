const Tower = require('./building_tower')
const Link = require('./building_link')
const Factory = require('./building_factory')
const PowerSpawn = require('./building_powerSpawn')
const Spawn = require('./building_spawn')


function controller_buildings() {

  for (s of Object.values(Game.structures)) {

    try {

      switch (s.structureType) {
        case STRUCTURE_TOWER:
          Tower(s)
          break
        case 'link':
          Link(s)
          break
        case 'factory':
          Factory(s)
          break
        case 'spawn':
          Spawn(s)
          break
        case 'powerSpawn':
          PowerSpawn(s)
          break
        default:
          break
      }



      // if (s.structureType == STRUCTURE_TOWER) {
      //   Tower(s)
      // }
      // if (s.structureType == STRUCTURE_LINK) {
      //   Link(s)
      // }
      // // if (s.structureType == STRUCTURE_TERMINAL) {
      // //   Terminnal(s)
      // // }
      // if (s.structureType == STRUCTURE_FACTORY) {
      //   Factory(s)
      // }
      // // if (s.structureType == STRUCTURE_TOWER) {
      // //   Tower(s)
      // // }
      // if (s.structureType == STRUCTURE_POWER_SPAWN) {
      //   PowerSpawn(s)
      // }
    }
    catch (e) {
      console.log('!!!!!!!!!!!!ERROR FOUND IN ' + s + ' CONTROLL!!!!!!!!!' + e)
      console.log(e.stack)

    }

  }
}

module.exports = controller_buildings;

