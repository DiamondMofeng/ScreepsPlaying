const Tower = require('./role_tower')


function controller_towers() {
  //tower beheavor crontroller
  let towers = _.filter(Object.values(Game.structures), s => s.structureType == STRUCTURE_TOWER)

  for (t of towers) {
    // console.log(t)
    Tower(t)
  }
}

module.exports = controller_towers;

