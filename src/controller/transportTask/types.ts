import type { TransportTaskName } from '@/tasks/transport/types'
import type { AnyTransportTask } from '@/tasks/transport'

export type RoomTaskPublisher = {
  name: TransportTaskName,
  limit: number,
  interval: number,
  weight: number,

  maxDuration: number,

  /** always do if not exists */
  shouldPublish?: (room: Room) => boolean,
  /** 任务发布器 */
  getGenerator: (room: Room) => null | (() => AnyTransportTask),

}