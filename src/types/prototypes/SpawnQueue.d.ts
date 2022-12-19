
interface CreepToSpawn {
  body: BodyPartConstant[];
  name?: string;
  role?: string;
  memory: any;
  spawnOpt?: SpawnOptions;
  priority: number;
}

//访问时如果没有会自动初始化，所以不是可选属性
interface Room {
  spawnQueue: CreepToSpawn[];
  pushToSpawnQueue(creepToSpawn: CreepToSpawn): void;
}

interface RoomMemory {
  spawnQueue: CreepToSpawn[];
}

interface StructureSpawn {
  spawnFromQueue(): ScreepsReturnCode;
}

