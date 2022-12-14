
interface Creep extends RoomObject {
  memory: CreepMemory;
}

interface CreepMemory {
  role?: string;
  task?: BasicTask;
}



