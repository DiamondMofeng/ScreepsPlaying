import { isDefined, isStructureType } from "@/utils/typer"
import { TransferTask } from ".."

interface FillFactoryTransferTask extends TransferTask {
  name: 'fill_factory',

  type: 'transfer'
  to: Id<StructureFactory>[]

  resourceType: ResourceConstant
}

export function FillFactoryTransferTaskPublisher(roomName: string): FillFactoryTransferTask[] {

  const resourceType = 'energy'//TODO 这里只是用来测试的，需要改成真正的逻辑

  const room = Game.rooms[roomName];
  if (!room) {
    return []
  }

  //TODO use cache
  const factory = room.find(FIND_MY_STRUCTURES, { filter: isStructureType(STRUCTURE_FACTORY) })[0]
  if (!factory) {
    return []
  }

  const fromIds = [room.storage, room.terminal]
    .filter(isDefined)
    .map(s => s.id)

  if (!fromIds.length) {
    return []
  }


  function generateTask(): FillFactoryTransferTask {
    return {
      name: 'fill_factory',
      id: Math.random().toString(36).substr(2, 9) + '_' + Game.time,
      weight: Infinity,
      startTick: Game.time,
      expirationTick: Infinity,
      workerCreeps: [],
      workerLimit: 1,
      type: 'transfer',
      from: fromIds,
      to: [factory.id],
      resourceType: resourceType,
      targetCapacity: undefined,
    };
  }

  return new Array(1).fill(0).map(generateTask);
}