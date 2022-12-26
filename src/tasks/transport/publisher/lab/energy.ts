import { isDefined } from "@/utils/typer";
import type { TransferTask } from "../..";

const MIN_ENERGY = 1200;

interface LabEnergyTask extends TransferTask {
  name: 'fill_lab_energy',

  type: 'transfer'
  to: Id<StructureLab>[]

  resourceType: RESOURCE_ENERGY
}


export function LabEnergyTaskPublisher(roomName: string): LabEnergyTask[] {
  const room = Game.rooms[roomName];
  if (!room?.controller?.my) {
    return []
  }

  const targetIds = room.labs
    .filter(l => l.store[RESOURCE_ENERGY] < MIN_ENERGY)
    .map(l => l.id)

  if (targetIds.length === 0) {
    return []
  }

  const fromIds = [room.storage, room.terminal]
    .filter(isDefined)
    .map(s => s.id)

  function generateTask(): LabEnergyTask {
    return {
      name: 'fill_lab_energy',
      id: `fill_lab_energy_${roomName}_${Math.floor(Math.random() * 1000)}`,  //TODO use uuid
      weight: 0,
      startTick: Game.time,
      expirationTick: Game.time + 1000,
      type: 'transfer',
      from: fromIds,
      to: targetIds,
      resourceType: RESOURCE_ENERGY,
      targetCapacity: MIN_ENERGY,
    }
  }

  return new Array(1).fill(0).map(generateTask)

}