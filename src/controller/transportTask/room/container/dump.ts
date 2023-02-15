import { randomId } from "@/utils/random";
import { isDefined, looseConcat } from "@/utils/typer";
import type { WithdrawTask } from "../../../../tasks/transport";
import { transportTaskConfig } from "../../config";
import type { RoomTaskPublisher } from "../../types";

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

export const dumpContainerTaskPublisher: RoomTaskPublisher = {
  name: 'dump_container',
  maxDuration: 500,
  ...transportTaskConfig['dump_container'],
  getGenerator: DumpContainerTaskPublisher
}

function DumpContainerTaskPublisher(room: Room): null | (() => DumpContainerTask) {

  if (!room?.controller?.my) {
    return null
  }

  const fromIds = room.containers
    .filter(s => s.type === 'source')
    .filter(
      s => s.store['energy'] > MAX_ENERGY_HARVESTER_CONTAINER
        || s.store.getUsedCapacity() !== s.store['energy']
    )
    .map(s => s.id)

  if (fromIds.length === 0) {
    return null
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
      id: randomId(`dump_container_${room.name}`),  //TODO use uuid
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

  return generateTask

}
