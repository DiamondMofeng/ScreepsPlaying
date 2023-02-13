import _ from 'lodash'
import { useRoomCache } from '@/utils/hooks/useRoomCache'
import * as roomTasks from './transportTask/room'

export function publishRoomTasks(room: Room) {

  const center = room.transportTaskCenter

  // 清理任务
  center.pauseAllDeadCreepsTasks()
  center.removeAllDoneTasks()

  center.taskQueue = center.taskQueue.filter(task => task.expirationTick > Game.time)
  for (const [id, task] of Object.entries(center.acceptedTasks)) {
    if (task.expirationTick > Game.time) {
      center.removeAcceptedTaskById(id);
    }
  }


  // 新增任务
  const roomTaskCounter = useRoomCache(
    room.name,
    'transportTasksCounter',
    () => _(center.taskQueue.concat(Object.values(center.acceptedTasks)))
      .countBy(task => task.name)
      .value()
  )

  for (const publisher of Object.values(roomTasks)) {

    const currentTaskCount = roomTaskCounter[publisher.name] ?? 0;
    const taskLimit = publisher.limit ?? 1;

    if (currentTaskCount < taskLimit && publisher.shouldPublish?.(room) !== false) {
      const tasks = publisher.publish(room, taskLimit - currentTaskCount);
      tasks.forEach(task => center.addTask(task));
      roomTaskCounter[publisher.name] = currentTaskCount + tasks.length;
    }

  }
}