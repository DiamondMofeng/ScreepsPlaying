const Tower = require('./building_tower')


function controller_buildings() {
  //tower beheavor crontroller
  let towers = _.filter(Object.values(Game.structures), s => s.structureType == STRUCTURE_TOWER)

  for (t of towers) {
    // console.log(t)
    Tower(t)
  }
}

module.exports = controller_buildings;

