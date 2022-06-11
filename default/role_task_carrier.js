
const RM_CARRIER_TASK = 'carrierTasks'

const CREEP_MEMORY_TASK = 'task'

const TASKTYPE_CARRIER = 'carrier'

/**
 * 
 * @param {Creep} creep 
 */
const task_carrier = (creep) => {
  if (creep.memory.task == undefined) {

    creep.memory.task = creep.room.taskCenter.getTasksByType(TASKTYPE_CARRIER)

  }

  


}
