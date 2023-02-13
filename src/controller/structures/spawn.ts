export const Spawn = (spawn: StructureSpawn) => {

  if (spawn.spawning) {
    return;
  }

  spawn.spawnFromQueue()

}