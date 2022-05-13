
// /**
//  * 
//  * @param {Room} room 
//  */
// const processSpawnQueue = (room) => {
//   if (!room.memory.spawnQueue || !room.memory.spawnQueue.length) {
//     return ['None']
//   }
//   return room.spawnQueue.map((creepToSpawn) => creepToSpawn.name || creepToSpawn.role || creepToSpawn.memory.role)
// }

const showRoomRoleCounts = () => {

  let counts = global.creepCountsByRoom
  for (let room of Object.values(Game.rooms)) {
    if (!room.controller || !room.controller.my) {
      return
    }

    let counts = global.creepCountsByRoom[room.name]
    let v = new RoomVisual(room.name)

    let y = 25
    for (let roleName in counts) {
      v.text(`${roleName} : ${counts[roleName]}`, 40, y++, { align: 'center' })
    }

  }

}

module.exports = { showRoomRoleCounts }