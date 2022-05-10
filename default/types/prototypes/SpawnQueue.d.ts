interface CreepToSpawn {
  body: BodyPartConstant[];
  name?: string;
  role?: string;
  memory: Object;
  spawnOpt?: SpawnOptions;
  priority: number;
}

interface Room {
  spawnQueue: Array<CreepToSpawn>;
  pushToSpawnQueue(creepToSpawn: CreepToSpawn): void;

}

interface StructureSpawn {
  spawnFromQueue(): void;
}
