import { AnyTransportTask, TransportTaskCenter } from ".";

interface TransportTaskCenterMemory {
  taskQueue: AnyTransportTask[];
  acceptedTasks: Record<AnyTransportTask['id'], AnyTransportTask>;
}

declare global {
  interface Room {
    transportTaskCenter: TransportTaskCenter
    _transportTaskCenter: TransportTaskCenter
  }

  interface RoomMemory {
    transportTaskCenter: TransportTaskCenterMemory
  }
}


export const mountTransportTaskCenter = () => {

  Object.defineProperties(Room.prototype, {

    transportTaskCenter: {
      get: function () {

        if (!this._transportTaskCenter) {
          //初始化memory
          if (!this.memory.transportTaskCenter) {
            this.memory.transportTaskCenter = {
              taskQueue: [],
              acceptedTasks: {},
            };
          }

          this._transportTaskCenter = new TransportTaskCenter(
            this.memory.transportTaskCenter.taskQueue,
            this.memory.transportTaskCenter.acceptedTasks
          );
        }
        return this._transportTaskCenter;
      },

      configurable: false,
      enumerable: false,
    },


  } as PropertyDescriptorMap & ThisType<Room>)

}