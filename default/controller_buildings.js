const Tower = require('./building_tower')
const Link = require('./building_link')



function controller_buildings(roomID) {

  for (s of Game.rooms[roomID].find(FIND_STRUCTURES)) {

    if (s.structureType == STRUCTURE_TOWER) {
      Tower(s)
    }
    if (s.structureType == STRUCTURE_LINK) {
      Link(s)
    }
    // if (s.structureType == STRUCTURE_TOWER) {
    //   Tower(s)
    // }
  }
}

module.exports = controller_buildings;

