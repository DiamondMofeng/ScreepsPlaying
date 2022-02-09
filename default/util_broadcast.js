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

//main
const broadcaster = () => {


  //Spawn's energy left
  const energy = Game.spawns['Spawn1'].room.energyAvailable
  const energyCapacity = Game.spawns['Spawn1'].room.memory.energyCapacity
  console.log(`Spawn1 has ${energy}/${energyCapacity} Energy left`)

  creepRoleCounter(['harvesterPlus',
    'carrier',
    'repairer',
    'builder',
    'upgrader',
    'sweepper',


    'long_pionner',
    'long_reserver'
  ])
}

module.exports =
  broadcaster
  ;