
/**
 * 
 * @param {Room} room 
 */
const processSpawnQueue = (room) => {
  if (!room.memory.spawnQueue || !room.memory.spawnQueue.length) {
    return ['None']
  }
  return room.spawnQueue.map((creepToSpawn) => creepToSpawn.name || creepToSpawn.role || creepToSpawn.memory.role)
}

const showRoomSpawnQueue = () => {
  for (let room of Object.values(Game.rooms)) {
    if (!room.controller || !room.controller.my) {
      return
    }


    let spawnQueue = processSpawnQueue(room)
    let v = new RoomVisual(room.name)

    let y = 25
    for (let toSpawn of spawnQueue) {
      v.text(toSpawn, 25, y++, { align: 'center' })
    }

  }

}

module.exports = { processSpawnQueue, showRoomSpawnQueue }