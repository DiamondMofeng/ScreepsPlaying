/** 影响任务结束条件 */
export type TransportTaskType =
  | "transfer"
  | "withdraw"
  | "pickup"

export type TransportTaskName =
  // string
  | 'fill_extension'  //填充ext,spawn
  | 'fill_tower'      //填充tower

  | 'dump_container'  //清空container

  | 'fill_lab_energy' //填充lab能量
  | "fill_lab"        //填充lab原料
  | "harvest_lab"     //回收lab产物

  | "fill_factory"

  | "clear"           //清空from目标建筑


  | "misc"            //杂项
  ;
