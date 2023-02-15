// import { RECIPES_LAB } from "@/utils/recipe";
// import { isDefined } from "@/utils/typer";
// import type { TransferTask, WithdrawTask } from "../../../../tasks/transport";
// import type { LabResourceConstant } from "./type";

// //TODO 没考虑分解时的情况
// //TODO 还没写换货时的逻辑
// //TODO 还没写如何自动获取合成目标

// // const MOCK_RAW = RESOURCE_LEMERGIUM
// const MOCK_PRODUCT = RESOURCE_UTRIUM_LEMERGITE


// const MIN_RAW = 2000;
// const MAX_PRODUCT = 1000;

// interface FillLabTransferTask extends TransferTask {
//   name:
//   | 'fill_lab'
//   | `fill_lab_${LabResourceConstant}`,

//   type: 'transfer'
//   to: Id<StructureLab>[]

//   resourceType?: LabResourceConstant
// }

// interface HarvestLabWithdrawTask extends WithdrawTask {
//   name: 'harvest_lab',

//   type: 'withdraw'
//   from: Id<StructureLab>[]

//   resourceType?: LabResourceConstant
// }

// export function FillLabTaskPublisher(roomName: string): FillLabTransferTask[] {

//   let room = Game.rooms[roomName];
//   if (!room?.controller?.my) {
//     return [];
//   }

//   const fromIds = [room.storage, room.terminal]
//     .filter(isDefined)
//     .map(s => s.id);

//   const materials = RECIPES_LAB[MOCK_PRODUCT]
//   // console.log('materials: ', materials);


//   const res: FillLabTransferTask[] = [];

//   for (let i = 0; i < 2; i++) {

//     let m = materials[i]

//     //TODO 这块逻辑不大严谨

//     const rawLabs = room.labs
//       .filter(isDefined)
//       .filter(l => l.type === 'raw')

//     const rawLab = rawLabs.find(l => l.mineralType === m) ?? rawLabs[i]

//     if (!rawLab || rawLab.store.getUsedCapacity(m) > MIN_RAW) {
//       continue
//     }

//     const rawIds = [
//       rawLab?.id,
//     ]

//     if (rawIds.length === 0) {
//       continue
//     }

//     // eslint-disable-next-line no-inner-declarations
//     function generateTask(): FillLabTransferTask {
//       return {
//         name: `fill_lab_${m}`,
//         id: `fill_lab_${m}_${roomName}_${Math.floor(Math.random() * 1000)}`,  //TODO use uuid
//         weight: 0,
//         startTick: Game.time,
//         expirationTick: Game.time + 1000,
//         type: 'transfer',
//         from: fromIds,
//         to: rawIds,
//         resourceType: m,
//         targetCapacity: MIN_RAW,
//       }
//     }

//     res.push(generateTask())

//   }

//   return res
// }

// export function HarvestLabTaskPublisher(roomName: string): HarvestLabWithdrawTask[] {

//   let room = Game.rooms[roomName];
//   if (!room?.controller?.my) {
//     return [];
//   }

//   const targetIds = room.labs
//     .filter(isDefined)
//     .filter(l => l.type === 'reaction'
//       && l.store.getUsedCapacity(MOCK_PRODUCT) > MAX_PRODUCT
//     )
//     .map(l => l.id);

//   if (targetIds.length === 0) {
//     return [];
//   }

//   const fromIds = [room.storage, room.terminal]
//     .filter(isDefined)
//     .map(s => s.id);

//   function generateTask(): HarvestLabWithdrawTask {
//     return {
//       name: 'harvest_lab',
//       id: `harvest_lab_${roomName}_${Math.floor(Math.random() * 1000)}`,  //TODO use uuid
//       weight: 0,
//       startTick: Game.time,
//       expirationTick: Game.time + 1000,
//       type: 'withdraw',
//       from: targetIds,
//       to: fromIds,
//       resourceType: MOCK_PRODUCT,
//       targetCapacity: MAX_PRODUCT,
//     }
//   }

//   return new Array(1).fill(0).map(generateTask)
// }