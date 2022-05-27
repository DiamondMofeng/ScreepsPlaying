

interface TaskCenter {
  Tasks: BasicTask[];
  addTask(task: BasicTask): void;
  removeTask(taskID: string): void;

  getTaskByID(taskID: string): BasicTask;
  getTasksByType(taskType: string): BasicTask[];
  getTasksByCreep(creep: Creep): BasicTask[];
}


interface Room {
  TaskCenter: TaskCenter;
}


interface BasicTask {
  readonly taskID: string;
  readonly taskType: string;

  priority: number;

  createTime: number;
  expireTime: number;

  // target: string;
  // targetId: string;
  // targetPos: RoomPosition;
  // targetRoomName: string;
  // task: string;
  // creep: Creep;
}