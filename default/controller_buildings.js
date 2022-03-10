const Tower = require('./building_tower')
const Link = require('./building_link')
const Factory = require('./building_factory')


function controller_buildings(roomID) {

  for (s of Game.rooms[roomID].find(FIND_STRUCTURES)) {

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
    }

    catch (e) {
      console.log('!!!!!!!!!!!!ERROR FOUND IN ' + s + ' CONTROLL!!!!!!!!!' + e)

    }

  }
}

module.exports = controller_buildings;

