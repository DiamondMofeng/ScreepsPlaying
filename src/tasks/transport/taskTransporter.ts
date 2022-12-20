import { isDefined, resourceTypesIn } from "@/utils/typer";
import { AnyTransportTask, PickupTask, TransferTask, TransportTaskCenter, transportTaskCompareFn, WithdrawTask } from ".";

interface TaskTransporterMemory extends CreepMemory {
  taskID?: string
}

/**
 * 流程：
 * 1.尝试申请新任务
 * 2.做任务
 * 3.检查任务是否完成，若完成则清除任务
 */


export function TaskTransporter(creep: Creep) {
  const mockTransportCenter = {} as TransportTaskCenter;
  const CM: TaskTransporterMemory = creep.memory;

  // 请求任务
  // 调整CM.taskId到合适状态
  function tryRequestTask(): AnyTransportTask | undefined {

    //如果存在任务id但是不存在任务，则清除任务id
    if (CM.taskID && !mockTransportCenter.getAcceptedTaskById(CM.taskID)) {
      CM.taskID = undefined;
    }

    // 如果当前没有任务，直接领取最新任务
    // 因为紧急任务总是在最前面，所以不用担心
    if (!CM.taskID) {
      let task = mockTransportCenter.requestTask();
      if (task) {
        CM.taskID = task.id;
      }
      return
    }

    // 如果当前有任务
    // 如果存在更紧急的任务，则暂停当前任务，领取紧急任务
    let curTask = mockTransportCenter.getAcceptedTaskById(CM.taskID);
    if (!curTask) {
      throw new Error('程序不应该进行到这里')
    }

    let frontTask = mockTransportCenter.peekTask();
    if (frontTask && transportTaskCompareFn(frontTask, curTask) > 0) {
      mockTransportCenter.pauseAcceptedTaskById(CM.taskID);
      CM.taskID = undefined;

      let newTask = mockTransportCenter.requestTask();
      if (newTask) {
        CM.taskID = newTask.id;
      } else {
        throw new Error('程序不应该进行到这里2')
      }
      return
    }
  }

  tryRequestTask();
  if (!CM.taskID) {
    return;
  }
  let task = mockTransportCenter.getAcceptedTaskById(CM.taskID);
  if (!task) {
    throw new Error('程序不应该进行到这里3')
  }

  //TODO 做任务
  doTransportTask(creep, task);
}

/**
 * 从多个来源中取出资源
 * @param creep
 * @param fromIds
 * @param resourceType
 * @param targetCapacity - 取到最少剩多少。不是withdraw任务的话不要填
 */
function withdrawFrom(creep: Creep, fromIds: Id<AnyStoreStructure>[], resourceType?: ResourceConstant, targetCapacity?: number) {
  let fromStructures = fromIds
    .map(id => Game.getObjectById(id))
    .filter(isDefined);

  let target = creep.pos.findClosestByPath(fromStructures, {

    filter: (s) => {
      if (resourceType && s.store[resourceType] === 0) {
        return false;
      }
      if (targetCapacity && (s.store.getUsedCapacity(resourceType) ?? 0) <= targetCapacity) {
        return false;
      }
      if (resourceTypesIn(s.store).length === 0) {
        return false;
      }
      return true;
    }
  });
  if (!target) {
    return ERR_NOT_FOUND;
  }

  let amount = Math.min(
    creep.store.getFreeCapacity(),
    (target.store.getUsedCapacity(resourceType) ?? 0) - (targetCapacity ?? 0)
  );

  return creep.withdraw(target,
    resourceType ?? resourceTypesIn(target.store)[0],
    amount
  );
}

/**
 * 从多个目标中存入资源
 * @param creep
 * @param toIds
 * @param resourceType
 * @param targetCapacity - 存到最多剩多少。不是transfer任务的话不要填
  */
function transferTo(creep: Creep, toIds: Id<AnyStoreStructure>[], resourceType?: ResourceConstant, targetCapacity?: number) {
  let toStructures = toIds
    .map(id => Game.getObjectById(id))
    .filter(isDefined);

  let target = creep.pos.findClosestByPath(toStructures, {

    filter: (s) => {
      if (resourceType && s.store.getFreeCapacity(resourceType) === 0) {
        return false;
      }
      if (targetCapacity && (s.store.getFreeCapacity(resourceType) ?? 0) <= targetCapacity) {
        return false;
      }
      if (resourceTypesIn(s.store).length === 0) {
        return false;
      }
      return true;
    }
  });
  if (!target) {
    return ERR_NOT_FOUND;
  }

  let amount = Math.min(
    creep.store.getUsedCapacity(resourceType),
    (target.store.getFreeCapacity(resourceType) ?? 0) - (targetCapacity ?? 0)
  );

  return creep.transfer(target,
    resourceType ?? resourceTypesIn(target.store)[0],
    amount
  );

}



function doTransportTask(creep: Creep, task: AnyTransportTask) {


  switch (task.type) {
    case "transfer":
      doTransferTask(creep, task);
      break;
    case "withdraw":
      doWithdrawTask(creep, task);
      break;
    case "pickup":
      doPickupTask(creep, task);
      break;
    default:
      throw new Error('未知的任务类型')
  }

}

function doTransferTask(creep: Creep, task: TransferTask) {

  const { from, to, resourceType, targetCapacity } = task;

  if (creep.store.getUsedCapacity(resourceType) === 0) {
    withdrawFrom(creep, from, resourceType, undefined);
  } else {
    transferTo(creep, to, resourceType, targetCapacity);
  }

}

function doWithdrawTask(creep: Creep, task: WithdrawTask) {
  //TODO
}

function doPickupTask(creep: Creep, task: PickupTask) {
  //TODO
}



