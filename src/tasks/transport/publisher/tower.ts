// import { isStructureTypeAmong } from "@/utils/typer";
import { isDefined, isStructureTypeAmong } from "@/utils/typer";
import type { TransferTask } from "..";

const TASK_NUM = 1;
const MIN_TOWER_ENERGY = 800  //感觉起的名字有点差

interface FillExtensionTransferTask extends TransferTask {
  name: 'fill_tower',

  type: 'transfer'
  to: Id<StructureTower>[]

  resourceType?: RESOURCE_ENERGY
}


export function FillTowerTaskPublisher(roomName: string): FillExtensionTransferTask[] {
  //为所有能量较少的tower填充能量

  let room = Game.rooms[roomName]
  if (!room?.controller?.my) {
    return []
  }

  //TODO use cache
  const targetIds = Game.rooms[roomName]
    .find(FIND_MY_STRUCTURES)
    .filter(isStructureTypeAmong([STRUCTURE_TOWER]))
    .filter(s => s.store[RESOURCE_ENERGY] < MIN_TOWER_ENERGY)
    .map(s => s.id)

  if (targetIds.length === 0) {
    return []
  }

  const fromIds = [room.storage, room.terminal]
    .filter(isDefined)
    .map(s => s.id)

  function generateTask(): FillExtensionTransferTask {
    return {
      name: 'fill_tower',
      id: `fill_tower_${roomName}_${Math.floor(Math.random() * 1000)}`,  //TODO use uuid
      weight: 0,
      startTick: Game.time,
      expirationTick: Game.time + 1000,
      type: 'transfer',
      from: fromIds,
      to: targetIds,
      resourceType: RESOURCE_ENERGY,
    }
  }

  return new Array(TASK_NUM).fill(0).map(generateTask)

}
