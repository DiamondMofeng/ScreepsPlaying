/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('util_ broadcast');
 * mod.thing == 'a thing'; // true
 */

const creepRoleCounter = (roleTypeArray) => {
  // console.log(roleTypeArray)
  for (i in roleTypeArray) {
    // console.log(role)
    console.log(`${roleTypeArray[i]}: ${_.filter(Game.creeps, (creep) => creep.memory.role == roleTypeArray[i]).length}`)
  }
}

const energyLeftOf = (constructName) => {
  const energy = Game.spawns['Spawn1'].store.getUsedCapacity(RESOURCE_ENERGY)
  console.log(`Spawn1 has ${energy} Energy left`)
}

//main
const broadcaster = () => {


  //Spawn's energy left
  const energy = Game.spawns['Spawn1'].store.getUsedCapacity(RESOURCE_ENERGY)
  console.log(`Spawn1 has ${energy} Energy left`)

  creepRoleCounter(['harvester', 'repairer', 'builder', 'upgrader'])
}

module.exports =
  broadcaster
  ;