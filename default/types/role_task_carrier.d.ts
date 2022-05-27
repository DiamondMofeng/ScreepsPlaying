
interface Creep extends RoomObject {
  memory: CreepMemory;
}

interface CreepMemory {
  role?: string;
  task?: string;
}



interface Task_Carrier extends BasicTask {
  taskType: string;
  carryTaskType: string;
  // fromID?: string | Id;
  fromIDs: string[];
  // toID?: string | Id;
  toIDs: string[]
  resourceType: ResourceConstant;
  amount: number;

}

