
/**
 * 
 * @param {Room} room 
 */
const processSpawnQueue = (room) => {
  if (!room.memory.spawnQueue) {
    return ['None']
  }
  return room.spawnQueue.map((creepToSpawn) => creepToSpawn.name || creepToSpawn.role || creepToSpawn.memory.role)
}

const showRoomSpawnQueue = () => {
  for (let room of Object.values(Game.rooms)) {
    let spawnQueue = processSpawnQueue(room)
    let v = new RoomVisual(room.name)

    let y = 1
    for (let toSpawn of spawnQueue) {
      v.text(toSpawn, 5, y++, { align: 'center' })
    }

  }

}

module.exports = { processSpawnQueue, showRoomSpawnQueue }