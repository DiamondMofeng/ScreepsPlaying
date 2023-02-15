import { randomId } from "@/utils/random";
import { isDefined } from "@/utils/typer";
import type { TransferTask } from "../../../../tasks/transport";
import type { RoomTaskPublisher } from "../../types";
import { transportTaskConfig } from "../../config";

const MIN_ENERGY = 1200;

interface LabEnergyTask extends TransferTask {
  name: 'fill_lab_energy',

  type: 'transfer'
  to: Id<StructureLab>[]

  resourceType: RESOURCE_ENERGY
}

export const fillLabEnergyTaskPublisher: RoomTaskPublisher = {
  name: 'fill_lab_energy',
  maxDuration: 500,
  ...transportTaskConfig['fill_lab_energy'],

  getGenerator: getGenerator,
}


function getGenerator(room: Room): null | (() => LabEnergyTask) {
  if (!room?.controller?.my) {
    return null
  }

  const targetIds = room.labs
    .filter(l => l.store[RESOURCE_ENERGY] < MIN_ENERGY)
    .map(l => l.id)

  if (targetIds.length === 0) {
    return null
  }

  const fromIds = [room.storage, room.terminal]
    .filter(isDefined)
    .map(s => s.id)

  return () => (
    {
      name: 'fill_lab_energy',
      id: randomId(`fill_lab_energy_${room.name}_`),
      weight: fillLabEnergyTaskPublisher.weight,
      startTick: Game.time,
      expirationTick: Game.time + fillLabEnergyTaskPublisher.maxDuration,
      type: 'transfer',
      from: fromIds,
      to: targetIds,
      resourceType: RESOURCE_ENERGY,
      targetCapacity: MIN_ENERGY,
    })



}