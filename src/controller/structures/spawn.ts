export const runSpawn = (spawn: StructureSpawn) => {

  if (spawn.spawning) {
    return;
  }

  spawn.spawnFromQueue()

}