// import { isStructureTypeAmong } from "@/utils/typer";
import { isDefined, isStructureTypeAmong } from "@/utils/typer";
import type { TransferTask } from "..";

const TASK_NUM = 2

interface FillExtensionTransferTask extends TransferTask {
  name: 'fill_extension',

  type: 'transfer'
  to: Id<StructureSpawn | StructureExtension>[]

  resourceType?: RESOURCE_ENERGY
}





export function ExtensionTaskPublisher(roomName: string): FillExtensionTransferTask[] {
  //为所有spawn和extension填充能量

  let room = Game.rooms[roomName]
  if (!room?.controller?.my) {
    return []
  }

  //TODO use cache
  const targetIds = Game.rooms[roomName]
    .find(FIND_MY_STRUCTURES)
    .filter(isStructureTypeAmong([STRUCTURE_SPAWN, STRUCTURE_EXTENSION]))
    .filter(s => s.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
    .map(s => s.id)

  if (targetIds.length === 0) {
    return []
  }

  const fromIds = [room.storage, room.terminal]
    .filter(isDefined)
    .map(s => s.id)

  function generateTask(): FillExtensionTransferTask {
    return {
      name: 'fill_extension',
      id: 'fill_extension_' + roomName + Math.floor(Math.random() * 1000),  //TODO use uuid
      weight: 0,
      startTick: Game.time,
      expirationTick: Game.time + 1000,
      // workerCreep: undefined,
      type: 'transfer',
      from: fromIds,
      to: targetIds,
      resourceType: RESOURCE_ENERGY,
    }
  }

  return new Array(TASK_NUM).fill(0).map(generateTask)

}
