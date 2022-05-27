// interface TaskCenter {
//   Tasks: BasicTask[];
//   addTask(task: BasicTask): void;
//   removeTask(taskID: string): void;

//   getTaskByID(taskID: string): BasicTask;
//   getTasksByType(taskType: string): BasicTask[];
//   getTasksByCreep(creep: Creep): BasicTask[];
// }


// interface Room {
//   TaskCenter: TaskCenter;
// }

const mountTaskCenter = () => {

  class TaskCenter {
    constructor(tasks) {
      this.Tasks = tasks;
    }

    addTask(task) {
      this.Tasks.push(task);
      //使用priority向上浮动
      this.Tasks.sort((a, b) => {
        return a.priority - b.priority;
      });

    }
    removeTask(taskID) {
      this.Tasks = this.Tasks.filter(task => task.TaskID != taskID);
    }

    getTaskByID(taskID) {
      return this.Tasks.find(task => task.TaskID == taskID);
    }
    getTasksByType(taskType) {
      return this.Tasks.filter(task => task.TaskType == taskType);
    }
    getTasksByCreep(creep) {
      return this.Tasks.filter(task => task.Creep == creep);
    }

  }

  Object.defineProperties(Room.prototype, {
    TaskCenter: {
      get: function () {
        if (!this.memory.TaskCenter) {
          this.memory.TaskCenter = [];
        }
        if (!this._TaskCenter) {
          this._TaskCenter = new TaskCenter(this.memory.TaskCenter);
        }
        return this._TaskCenter;
      },
      enumerable: false
    },
  });

}
module.exports = mountTaskCenter;