import { isDefined, isStructureTypeAmong, looseConcat } from "@/utils/typer";
import type { WithdrawTask } from "..";

const TASK_NUM = 2

/** 存的能量超过这个值就应该发布任务被取走了 */
const MAX_ENERGY_HARVESTER_CONTAINER = 1000

interface DumpContainerTask extends WithdrawTask {
  name: 'dump_container',

  from: Id<StructureContainer>[]

  to: Id<
    | StructureContainer
    | StructureStorage
    | StructureTerminal
  >[]

  // targetCapacity: number
  // resourceType: RESOURCE_ENERGY
}



export function DumpContainerTaskPublisher(roomName: string): DumpContainerTask[] {

  let room = Game.rooms[roomName]
  if (!room?.controller?.my) {
    return []
  }

  //TODO use cache
  const fromIds = Game.rooms[roomName]
    .find(FIND_STRUCTURES)
    .filter(isStructureTypeAmong([STRUCTURE_CONTAINER]))
    .filter(s => s.type === 'source')
    .filter(
      s => s.store['energy'] > MAX_ENERGY_HARVESTER_CONTAINER
        || s.store.getUsedCapacity() !== s.store['energy']
    )
    .map(s => s.id)

  if (fromIds.length === 0) {
    return []
  }

  const toIds = looseConcat(
    room.containers
      .filter(c => c.type !== 'source'),
    // .filter(c => c.store['energy'] >= MAX_ENERGY_HARVESTER_CONTAINER),
    [room.storage, room.terminal]
  )
    .filter(isDefined)
    .map(s => s.id)

  function generateTask(): DumpContainerTask {
    return {
      name: 'dump_container',
      id: `dump_container_${roomName}_${Math.floor(Math.random() * 1000)}`,  //TODO use uuid
      weight: 100,
      startTick: Game.time,
      expirationTick: Game.time + 1000,
      type: 'withdraw',
      from: fromIds,
      to: toIds,
      // targetCapacity: MAX_ENERGY_HARVESTER_CONTAINER,
      // resourceType: RESOURCE_ENERGY,
    }
  }

  return new Array(TASK_NUM).fill(0).map(generateTask)

}
