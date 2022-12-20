import { AnyTransportTask, TransportTaskCenter, transportTaskCompareFn } from ".";

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
}


