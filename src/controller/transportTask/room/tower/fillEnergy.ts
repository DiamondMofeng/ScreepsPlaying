// import { isStructureTypeAmong } from "@/utils/typer";
import { randomId } from "@/utils/random";
import { isDefined } from "@/utils/typer";
import type { TransferTask } from "../../../../tasks/transport";
import { transportTaskConfig } from "../../config";
import type { RoomTaskPublisher } from "../../types";

const MIN_TOWER_ENERGY = 800  //感觉起的名字有点差

interface FillExtensionTransferTask extends TransferTask {
  name: 'fill_tower',

  type: 'transfer'
  to: Id<StructureTower>[]

  resourceType?: RESOURCE_ENERGY
  targetCapacity: number  // 不加的话，塔工作时会一直给同一个填
}

export const fillTowerTaskPublisher: RoomTaskPublisher = {
  name: 'fill_tower',
  maxDuration: 500,
  ...transportTaskConfig['fill_tower'],

  getGenerator: fillTowerTaskGenerator,
}

function fillTowerTaskGenerator(room: Room): null | (() => FillExtensionTransferTask) {
  //为所有能量较少的tower填充能量

  if (!room?.controller?.my) {
    return null
  }

  const targetIds = room.towers
    .filter(s => s.store[RESOURCE_ENERGY] < MIN_TOWER_ENERGY)
    .map(s => s.id)

  if (targetIds.length === 0) {
    return null
  }

  const fromIds = [room.storage, room.terminal]
    .filter(isDefined)
    .map(s => s.id)

  const generateTask = (): FillExtensionTransferTask => ({
    name: 'fill_tower',
    id: randomId('fill_tower_' + room.name + '_'),
    weight: fillTowerTaskPublisher.weight,
    startTick: Game.time,
    expirationTick: Game.time + fillTowerTaskPublisher.maxDuration,
    type: 'transfer',
    from: fromIds,
    to: targetIds,
    resourceType: RESOURCE_ENERGY,
    targetCapacity: MIN_TOWER_ENERGY,
  })

  return generateTask

}
