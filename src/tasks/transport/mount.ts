import { AnyTransportTask, TransportTaskCenter } from ".";

interface TransportTaskCenterMemory {
  taskQueue: AnyTransportTask[];
  acceptedTasks: Record<AnyTransportTask['id'], AnyTransportTask>;
}

declare global {
  interface Room {
    transportTaskCenter: TransportTaskCenter
    __transportTaskCenter: TransportTaskCenter
  }

  interface RoomMemory {
    transportTaskCenter: TransportTaskCenterMemory
  }
}


export const mountTransportTaskCenter = () => {

  Object.defineProperties(Room.prototype, {

    transportTaskCenter: {
      get: function () {

        if (!this.__transportTaskCenter) {
          //初始化memory
          if (!this.memory.transportTaskCenter) {
            this.memory.transportTaskCenter = {
              taskQueue: [],
              acceptedTasks: {},
            };
          }

          this.__transportTaskCenter = new TransportTaskCenter(
            this.memory.transportTaskCenter.taskQueue,
            this.memory.transportTaskCenter.acceptedTasks,
            this.name
          );
        }
        return this.__transportTaskCenter;
      },

      configurable: false,
      enumerable: false,
    },


  } as PropertyDescriptorMap & ThisType<Room>)

}