import { isDefined } from "@/utils/typer";
import type { TransferTask } from "@/tasks/transport";
import { RoomTaskPublisher } from "../../types";
import { transportTaskConfig } from "../../config";
import { randomId } from "@/utils/random";


interface FillExtensionTransferTask extends TransferTask {
  name: 'fill_extension',

  type: 'transfer'
  to: Id<StructureSpawn | StructureExtension>[]

  resourceType?: RESOURCE_ENERGY
}

export const fillExtensionTaskPublisher: RoomTaskPublisher = {
  name: 'fill_extension',
  maxDuration: 500,
  ...transportTaskConfig['fill_extension'],

  getGenerator(room: Room): null | (() => FillExtensionTransferTask) {
    if (!room?.controller?.my) {
      return null
    }

    const toIds = [...room.extensions, ...room.spawns]
      .filter(s => s.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
      .map(s => s.id)

    if (toIds.length === 0) {
      return null
    }

    const fromIds = [room.storage, room.terminal]
      .filter(isDefined)
      .map(s => s.id)

    return () => ({
      name: 'fill_extension',
      id: randomId('fill_extension' + room.name),
      weight: this.weight,
      startTick: Game.time,
      expirationTick: Game.time + this.maxDuration,
      type: 'transfer',
      from: fromIds,
      to: toIds,
      resourceType: RESOURCE_ENERGY,
    })


  }
}
