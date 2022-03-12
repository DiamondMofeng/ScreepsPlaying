//import





/**
 * 
 * @param {StructureSpawn} spawn 
 */
const roleSpawn = (spawn) => {

  if (_.isUndefined(spawn.room.memory.spawnQueue)) {
    spawn.room.memory.spawnQueue = []
  }
  let spawnQueue = spawn.room.memory.spawnQueue

  if (spawnQueue.length > 0) {
    let f = spawnQueue.shift()
    spawn.spawnCreep(f.body, f.name, f.opt)
  }

}
module.exports = roleSpawn