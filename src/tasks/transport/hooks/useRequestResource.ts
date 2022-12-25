// import { resInStore } from "@/utils/typer";
// import { TransportTaskName } from "..";

// interface RequestRoomResourceOptions {

//   /** 是否紧急 */
//   urgent?: boolean;
//   /** 任务的名字 */
//   name?: TransportTaskName;
//   /** 任务的目标容量。不填则送满 */
//   targetCapacity?: number
//   duration?: number
//   /** 任务的执行者creep的名字 */
//   workerCreep?: string;
// }

// /**
//  * @deprecated TODO 没做完    
//  * 快速创建房间内搬运任务请求   
//  * 不支持全搬
//  * @param target 目标
//  * @param resourceType 资源类型
//  * @param options 选项
//  * @returns {OK}
//  */
// export function useRequestResource<T extends AnyStoreStructure, R extends resInStore<T['store']>>(
//   target: T | T[],
//   resourceType: R,
//   options?: RequestRoomResourceOptions
// ): number {

//   const targets = Array.isArray(target) ? target : [target]

//   const center = targets[0].room.transportTaskCenter;

//   if (!center) {
//     return ERR_INVALID_TARGET;
//   }

//   // TODO




//   return 0;
// }
