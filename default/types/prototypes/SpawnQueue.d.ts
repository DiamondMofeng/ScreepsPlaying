interface CreepToSpawn {
  body: BodyPartConstant[];
  name?: string;
  role?: string;
  memory: any;
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
