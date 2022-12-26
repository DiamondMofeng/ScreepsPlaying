import { isStructureTypeAmong } from "@/utils/typer";
import type { TransferTask, WithdrawTask } from "../..";
import { LabResourceConstant } from "./type";


interface FillLabTransferTask extends TransferTask {
  name: 'fill_factory',

  type: 'transfer'
  to: Id<StructureLab>[]

  resourceType?: LabResourceConstant
}

interface HarvestLabWithdrawTask extends WithdrawTask {
  name: 'harvest_lab',

  type: 'withdraw'
  from: Id<StructureLab>[]

  resourceType?: LabResourceConstant
}

// export function LabTaskPublisher(roomName: string): FillLabTransferTask | HarvestLabWithdrawTask[] {
// }