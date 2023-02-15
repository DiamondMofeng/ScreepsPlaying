import { isDefined, resourceTypesIn } from "@/utils/typer";
import { moveAndTransfer, moveAndWithdraw } from "@/utils/util_beheavor";
import { AnyTransportTask, PickupTask, TransferTask, transportTaskCompareFn, WithdrawTask } from ".";

export interface TaskTransporterMemory extends CreepMemory {
  taskID?: string
}

function shouldReplaceTask(creep: Creep) {
  const CM: TaskTransporterMemory = creep.memory
  const center = creep.room.transportTaskCenter
  if (!CM.taskID) {
    return true
  }

  const task = center.getAcceptedTaskById(CM.taskID)
  if (!task) {
    return true
  }

  const frontTask = center.peekTask()
  if (frontTask?.urgent && transportTaskCompareFn(task, frontTask) < 0) {
    return true
  }

  return false;
}


/**
 * 流程：
 * 1.尝试申请新任务
 * 2.如果有任务就做任务
 *   如果没任务就倒store
 * 
 * 3.检查任务是否完成的步骤交给center做
 */


export function TaskTransporter(creep: Creep) {
  const CM: TaskTransporterMemory = creep.memory;
  const center = creep.room.transportTaskCenter;

  if (shouldReplaceTask(creep)) {
    center.requestAndBindTask(creep);
  }

  const task = center.getAcceptedTaskById(CM.taskID);
  if (!task) {
    return cleanStore(creep);
  }
  // console.log('doTransportTask')

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

  let target = creep.pos.findClosestByPath(fromStructures, {  //TODO 不要用findClosestByPath，找不到路会卡住

    filter: (s) => {

      // 指定资源类型时，没有这种资源
      if (resourceType && s.store[resourceType] === 0) {
        return false;
      }

      // 已经达成目标了
      if (targetCapacity && (s.store.getUsedCapacity(resourceType) ?? 0) <= targetCapacity) {
        return false;
      }

      // 完全没得取
      if (resourceTypesIn(s.store).length === 0) {
        return false;
      }
      return true;
    }
  });
  // console.log('target: ', target);
  if (!target) {
    return ERR_NOT_FOUND;
  }

  let amount = Math.min(
    creep.store.getFreeCapacity(),
    // (target.store.getUsedCapacity(resourceType) ?? 0) - (targetCapacity ?? 0)
    target.store.getUsedCapacity(resourceType) ?? 0
  );
  // console.log("withdraw res:", creep.withdraw(target,
  //   resourceType ?? resourceTypesIn(target.store)[0],
  //   amount
  // ))
  return moveAndWithdraw(creep, target, resourceType ?? resourceTypesIn(target.store)[0], amount);
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

  let target = creep.pos.findClosestByPath(toStructures, {  //TODO 不要用findClosestByPath，找不到路会卡住

    filter: (s) => {

      // 指定/不指定资源类型时，容器已满
      if (s.store.getFreeCapacity(resourceType) === 0) {
        return false;
      }

      // 已经达到目标了
      if (targetCapacity && (s.store.getUsedCapacity(resourceType) ?? 0) >= targetCapacity) {
        return false;
      }

      return true;
    }
  });
  // console.log('target: ', target);
  if (!target) {
    // console.log('transferTo ERR_NOT_FOUND: ', ERR_NOT_FOUND);
    return ERR_NOT_FOUND;
  }

  let amount = Math.min(
    creep.store.getUsedCapacity(resourceType),
    // (targetCapacity ?? target.store.getFreeCapacity(resourceType) ?? 0) - (target.store.getUsedCapacity(resourceType) ?? 0), //! 注释掉之后允许过量填装
    target.store.getFreeCapacity(resourceType) ?? 0
  );
  // console.log('amount: ', amount);
  // console.log("moveAndTransfer", moveAndTransfer(creep, target,
  //   resourceType ?? resourceTypesIn(target.store)[0],
  //   amount
  // ))
  return moveAndTransfer(creep, target,
    resourceType ?? resourceTypesIn(target.store)[0],
    amount
  );


}

/**
 * 将creep身上的资源清理到storage或terminal
 * @param creep
 * @param types - 指定清理的资源类型，不指定则清理所有
 */
function cleanStore(creep: Creep, types: ResourceConstant[] = []) {
  let resourceType = types.length === 0
    ? resourceTypesIn(creep.store)[0]
    : resourceTypesIn(creep.store).find(r => types.includes(r));

  if (!resourceType) {
    return;
  }

  let target = [creep.room.storage, creep.room.terminal]
    .filter(isDefined)
    .find(s => s.store.getFreeCapacity(resourceType) > 0)

  if (target) {
    moveAndTransfer(creep, target, resourceType)
  } else {
    console.log(`!!!!!creep ${creep.name} 无法清理store，因为没有可用的目标,导致扔掉了`)  //TODO use warning logger
    creep.drop(resourceType);
  }
}

function cleanStoreForTask(creep: Creep, task: AnyTransportTask) {
  if (task.resourceType &&
    creep.store.getUsedCapacity() > creep.store.getUsedCapacity(task.resourceType)
  ) {

    let uselessTypes = resourceTypesIn(creep.store).filter(r => r !== task.resourceType);
    if (!uselessTypes.length) {
      return;   //实际不应该能进行到这里
    }

    cleanStore(creep, uselessTypes);
  }
}



function doTransportTask(creep: Creep, task: AnyTransportTask) {
  if (task.resourceType &&
    creep.store.getUsedCapacity() > creep.store.getUsedCapacity(task.resourceType)
  ) {
    cleanStoreForTask(creep, task);
    // console.log(2)

    return;
  }
  // console.log(1)
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

  //TODO 随便写的，没确认逻辑合理性
  const { from, to, resourceType, targetCapacity } = task;

  //TODO 条件可以改成有空余容量
  if (creep.store.getUsedCapacity(resourceType) === 0) {
    withdrawFrom(creep, from, resourceType, targetCapacity);
  } else {
    transferTo(creep, to, resourceType, undefined);
  }
}

function doPickupTask(_creep: Creep, _task: PickupTask) {
  //TODO
}



