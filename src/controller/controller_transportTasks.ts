import _ from 'lodash'
import { useRoomCache } from '@/utils/hooks/useRoomCache'
import * as roomTasks from './transportTask/room'

export function controller_transportTasks() {
  for (const room of Object.values(Game.rooms)) {
    if (!room?.controller?.my) {
      continue
    }
    manageTasks(room)
  }
}


export function manageTasks(room: Room) {

  const center = room.transportTaskCenter

  // 清理任务
  center.pauseAllDeadCreepsTasks()
  center.removeAllDoneTasks()

  //TODO 抽为一个方法
  // center.taskQueue = center.taskQueue.filter(task => task.expirationTick > Game.time)
  for (const [id, task] of Object.entries(center.acceptedTasks)) {
    if (Game.time >= task.expirationTick) {
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

    // if (Game.time % publisher.interval !== 0) {
    //   continue;
    // }

    const currentTaskCount = roomTaskCounter[publisher.name] ?? 0;
    const taskLimit = publisher.limit ?? 1;

    if (currentTaskCount < taskLimit && publisher.shouldPublish?.(room) !== false) {
      const len = taskLimit - currentTaskCount;

      const taskGenerator = publisher.getGenerator(room);
      if (!taskGenerator) {
        continue;
      }

      const tasks = new Array(len).fill(0).map(taskGenerator);

      tasks.forEach(task => center.addTask(task));
      roomTaskCounter[publisher.name] = currentTaskCount + tasks.length;
    }

  }
}