/**
 * 
 * @param {StructureSpawn} spawn 
 */
const Spawn = (spawn) => {

  if (spawn.spawning) {
    return;
  }

  spawn.spawnFromQueue()

}
module.exports = Spawn

//StructureSpawn spawnQueue