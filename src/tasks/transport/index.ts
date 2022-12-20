import { isDefined } from "@/utils/typer";
import { bubbleDownDequeue, bubbleUpEnqueue } from "@/utils/util_priorityQueue";

/** 影响任务结束条件 */
export type TransportTaskType =
  | "transfer"
  | "withdraw"
  | "pickup"

export type TransportTaskName = string

// | "extension"   //填充ext,spawn

// | "fill_lab"    //填充lab原料
// | "harvest_lab" //回收lab产物

// | "clear"       //清空from目标建筑

// | "misc"        //杂项
// ;


interface TransportTask {
  //* 基础信息

  name: TransportTaskName;
  /** 任务的唯一标识 */
  id: string,
  weight: number, //优先级. 未提供则应初始化为Infinity

  /** 是否允许中断其他任务来强制执行本任务 */
  urgent?: boolean  //是否紧急。普通任务在做完后才会切换。当存在紧急任务时会直接中断普通任务。

  startTick: number,
  /** 到期tick */
  expirationTick: number,

  workerCreeps: string[], //执行者creep的名字
  workerLimit: number, //执行者上限

  //* 任务信息
  /** 取回/填充 */
  type: TransportTaskType,

  from: Id<AnyStoreStructure | Resource>[]
  to: Id<AnyStoreStructure>[]

  /** 不指定则全都搬，类似于搬空 */
  resourceType?: ResourceConstant
  /** 向to目标搬运的上限，若不提供则填满 */
  targetCapacity?: number //暂不考虑为每个单位单独设计
}

export interface WithdrawTask extends TransportTask {
  type: "withdraw",

  from: Id<AnyStoreStructure>[]
}

export interface TransferTask extends TransportTask {
  type: "transfer",

  from: Id<AnyStoreStructure>[]
}

export interface PickupTask extends TransportTask {
  type: "pickup",

  from: Id<Resource>[]
}

export type AnyTransportTask = WithdrawTask | TransferTask | PickupTask;

export function transportTaskCompareFn(a: TransportTask, b: TransportTask) {
  return ((+!!a.urgent) - (+!!b.urgent)) || (a.weight - b.weight);
}

export class TransportTaskCenter {

  taskQueue: AnyTransportTask[];
  acceptedTasks: Record<TransportTask['id'], AnyTransportTask>;

  constructor(
    taskQueue: AnyTransportTask[],
    acceptedTasks: Record<TransportTask['id'], AnyTransportTask>
  ) {
    this.taskQueue = taskQueue;
    this.acceptedTasks = acceptedTasks;
  }






  //* 任务管理

  addTask(task: TransportTask): void {
    bubbleUpEnqueue(this.taskQueue, task, transportTaskCompareFn);
  }

  removeAcceptedTaskById(taskId: TransportTask['id']): void {
    delete this.acceptedTasks[taskId];
  }

  removeAllDoneTasks(): void {
    Object.entries(this.acceptedTasks).forEach(([taskId, task]) => {
      if (this.isTaskDone(task)) {
        this.removeAcceptedTaskById(taskId);
      }
    });
  }

  getAcceptedTaskById(id: TransportTask['id']) {
    return this.taskQueue.find(task => task.id === id);
  }

  pauseAcceptedTaskById(id: TransportTask['id']) {
    const task = this.getAcceptedTaskById(id);
    if (isDefined(task)) {
      this.addTask(task);
    }
    this.removeAcceptedTaskById(id);
  }

  /** 
   * 供执行者获取最新任务，并将其从任务队列中移除，并将其加入已接受任务列表
  */
  requestTask(): AnyTransportTask | undefined {
    let task = bubbleDownDequeue(this.taskQueue, transportTaskCompareFn);
    if (isDefined(task)) {
      this.acceptedTasks[task.id] = task;
    }
    return task;
  }

  /**
   * 找到优先级最大的urgent任务   
   * ! 注: 应保证urgent任务永远排在普通任务前面
   */
  peekTask(): TransportTask | undefined {
    return this.taskQueue[0];
  }

  static bindCreepTo(task: TransportTask, creepName: string) {
    task.workerCreeps.push(creepName);
  }

  static removeWorkerAt(task: TransportTask, creepName: string) {
    const index = task.workerCreeps.indexOf(creepName);
    if (index !== -1) {
      task.workerCreeps.splice(index, 1);
    }
  }

  static cleanDeadWorkersAt(task: TransportTask) {
    task.workerCreeps = task.workerCreeps.filter(name => Game.creeps[name]);
  }


  //TODO 检查workerCreeps的对应资源为空是否合理
  #isWorkerCleaned(task: TransportTask): boolean {
    return task.workerCreeps
      .map(name => Game.creeps[name])
      // .filter(isDefined)
      .every(s => !s.store.getUsedCapacity(task.resourceType))
  }

  /**
   * 是否已填满所有的to
   */
  #isTransferTaskDone(task: TransferTask): boolean {

    return (task.to
      .map(id => Game.getObjectById(id))
      .filter(isDefined)
      .every(s => {
        if (!task.targetCapacity) {
          // 装不了更多了
          return !s.store.getFreeCapacity(task.resourceType);
        }
        return (s.store.getUsedCapacity(task.resourceType) ?? 0) >= task.targetCapacity;
      })
      && this.#isWorkerCleaned(task)
    )

  }

  #isWithdrawTaskDone(task: WithdrawTask): boolean {
    return (task.from
      .map(id => Game.getObjectById(id))
      .filter(isDefined)
      .every(s => {

        if (!task.targetCapacity) {
          //一点也没装
          return !s.store.getUsedCapacity(task.resourceType);
        }
        return (s.store.getUsedCapacity(task.resourceType) ?? 0) <= task.targetCapacity;
      })
      && this.#isWorkerCleaned(task)

    )
  }

  #isPickupTaskDone(task: PickupTask): boolean {
    return (task.from
      .map(id => Game.getObjectById(id))
      .filter(isDefined)
      .every(s => {
        if (!task.targetCapacity) {
          //被捡了就消失了，不应存在
          return false
        }
        return s.amount <= task.targetCapacity;
      })
      && this.#isWorkerCleaned(task)

    )
  }



  isTaskDone(task: AnyTransportTask): boolean {
    switch (task.type) {
      case "transfer":
        return this.#isTransferTaskDone(task);
      case "withdraw":
        return this.#isWithdrawTaskDone(task);
      case "pickup":
        return this.#isPickupTaskDone(task);
      default:
        throw new Error("未知的任务类型");
    }
  }




}

