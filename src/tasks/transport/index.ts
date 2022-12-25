import { useRoomCache } from "@/utils/hooks/useRoomCache";
import { isDefined } from "@/utils/typer";
import { bubbleDownDequeue, bubbleUpEnqueue } from "@/utils/util_priorityQueue";
import _ from "lodash";
import { ExtensionTaskPublisher } from "./publisher/extension";
import { FillFactoryTransferTaskPublisher } from "./publisher/factory";
import { FillTowerTaskPublisher } from "./publisher/tower";
import { TaskTransporterMemory } from "./taskTransporter";

//TODO 处理任务卡死完不成的情况

/** 影响任务结束条件 */
export type TransportTaskType =
  | "transfer"
  | "withdraw"
  | "pickup"

export type TransportTaskName =
  // string
  | 'fill_extension' //填充ext,spawn
  | 'fill_tower'     //填充tower

  | "fill_lab"    //填充lab原料
  | "harvest_lab" //回收lab产物

  | "fill_factory"

  | "clear"       //清空from目标建筑


  | "misc"        //杂项
  ;


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

  workerCreep?: string, //执行者creep的名字

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
  roomName: string;

  constructor(
    taskQueue: AnyTransportTask[],
    acceptedTasks: Record<TransportTask['id'], AnyTransportTask>,
    roomName: string
  ) {
    this.taskQueue = taskQueue;
    this.acceptedTasks = acceptedTasks;
    this.roomName = roomName;
  }

  //* 发布任务
  //应当在tick start阶段运行
  //TODO 分离到别的地方，这里太杂了
  publishTask(
    // publishers: (roomName: string) => AnyTransportTask[]
  ): void {

    const TASK_LIMITS: Record<TransportTaskName, number> = {
      'fill_extension': 2,
      'fill_tower': 1,
      'fill_lab': 1,
      'harvest_lab': 1,
      'fill_factory': 1,
      'clear': 1,
      'misc': 1,

    }

    const intervaledPublishers: Array<[number, (roomName: string) => AnyTransportTask[]]> = [
      [10, ExtensionTaskPublisher],
      [50, FillFactoryTransferTaskPublisher],
      [20, FillTowerTaskPublisher],
    ]

    const tasksToPublish = intervaledPublishers.reduce((tasks, [interval, publisher]) => {
      if (Game.time % interval === 0) {
        tasks.push(...publisher(this.roomName));
      }
      return tasks;
    }, [] as AnyTransportTask[])

    console.log('tasksToPublish: ', tasksToPublish);  //TODO debug

    //TODO 分到外面去
    const roomTaskCounter = useRoomCache(
      this.roomName,
      'transportTasksCounter',
      () => _(this.taskQueue.concat(Object.values(this.acceptedTasks)))
        .countBy(task => task.name)
        .value()
    )

    tasksToPublish.forEach(task => {

      const currentTaskCount = roomTaskCounter[task.name] ?? 0;
      const taskLimit = TASK_LIMITS[task.name] ?? 1;
      if (currentTaskCount < taskLimit) {
        this.addTask(task);
        roomTaskCounter[task.name] = currentTaskCount + 1;
      }

    })

  }



  //** 任务管理

  //* taskQueue

  addTask(task: TransportTask): void {
    bubbleUpEnqueue(this.taskQueue, task, transportTaskCompareFn);
  }

  /** 
   * 将最新任务移出队列，移入被接受列表，并返回此任务
   */
  requestAndAcceptTask(): AnyTransportTask | undefined {
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


  //* acceptedTask

  getAcceptedTaskById(id: TransportTask['id'] | undefined) {
    if (!id) { return undefined }
    return this.acceptedTasks[id];
  }

  /**
   * TODO 在这里清除creep的任务id是否恰当？
   * 通过id删除一个已接受的任务，同时清除对应creep的任务id
   */
  removeAcceptedTaskById(id: TransportTask['id']): void {
    const task = this.getAcceptedTaskById(id);
    if (task?.workerCreep) {
      const creep = Game.creeps[task.workerCreep];
      const CM: TaskTransporterMemory = creep?.memory
      if (creep && CM?.taskID === id) {
        CM.taskID = undefined;
      }
    }

    delete this.acceptedTasks[id];
  }

  removeAllDoneTasks(): void {
    Object.entries(this.acceptedTasks).forEach(([taskId, task]) => {
      console.log('this.isTaskDone(task): ', task.name, this.isTaskDone(task));
      if (this.isTaskDone(task)) {
        this.removeAcceptedTaskById(taskId);
      }
    });
  }

  //* Creep与任务中心的交互

  /**
   * 为creep分配新任务
   */
  requestAndBindTask(creep: Creep) {
    let CM: TaskTransporterMemory = creep.memory  //TODO type creep instead of memory
    const task = this.requestAndAcceptTask();
    if (isDefined(task)) {
      CM.taskID = task.id;
      task.workerCreep = creep.name;
    }

  }

  /**
   * pause意为将任务从 `已接受状态` 转为 `未接受状态`
   */
  pauseAcceptedTaskById(id: TransportTask['id']) {
    const task = this.getAcceptedTaskById(id);
    if (isDefined(task)) {
      task.workerCreep = undefined;
      this.addTask(task);
    }
    this.removeAcceptedTaskById(id);
  }

  //TODO 检查workerCreeps的对应资源为空是否合理
  #isWorkerCleaned(task: TransportTask): boolean {
    return Game.creeps[task.workerCreep!]?.store.getUsedCapacity(task.resourceType) === 0;  //safe
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
      // && this.#isWorkerCleaned(task)
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
      // && this.#isWorkerCleaned(task)

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
      // && this.#isWorkerCleaned(task)

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

