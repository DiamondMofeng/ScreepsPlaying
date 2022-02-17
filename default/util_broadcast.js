const roomSpawnEnergy = (roomName) => {
  const energy = Game.rooms[roomName].energyAvailable
  const energyCapacity = Game.rooms[roomName].energyCapacityAvailable
  console.log(`${roomName} has ${energy}/${energyCapacity} Energy left`)
}

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
  roomSpawnEnergy('W12N16')


  // creepRoleCounter(['harvesterPlus',
  //   'carrier',
  //   'repairer',
  //   'builder',
  //   'upgrader',
  //   'sweepper',

  //   'long_pionner',
  //   'long_reserver',
  //   'long_harvester',
  //   'long_carrier'
  // ])


}

module.exports =
  broadcaster
  ;