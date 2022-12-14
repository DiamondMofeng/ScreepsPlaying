

/**
 * 集中发布任务
 * @param {Room|String} room
 */
const taskCenter_carry = (room) => {

  if (typeof room === 'string') {
    room = Game.rooms[room];
  }
  if (!room || !room.controller || !room.controller.my) {
    return;
  }

  let taskCenter = room.taskCenter;
  if (!taskCenter) {
    return;
  }


  // 发布任务




}


/**
 * 
 * @param {Room} room 
 */
function publishTasks_carry(room){

  // Lab
  

  let labs = room.find(FIND_MY_STRUCTURES, {
    filter: (structure) => {
      return structure.structureType === STRUCTURE_LAB;
    }
  });

  if (labs.length > 0) {
    let task = new Task_carry(room, labs[0], 'lab');
    room.taskCenter.addTask({
      
    })
  }

}

module.exports = taskCenter_carry