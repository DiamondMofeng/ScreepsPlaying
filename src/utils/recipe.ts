/**
 * 工厂和Lab合成配方
 */

//TODO 类型写的很差，需要改进

//覆盖官方的REACTIONS，防止被污染
// declare const REACTIONS: {
//   H: {
//     O: "OH";
//     L: "LH";
//     K: "KH";
//     U: "UH";
//     Z: "ZH";
//     G: "GH";
//   };
//   O: {
//     H: "OH";
//     L: "LO";
//     K: "KO";
//     U: "UO";
//     Z: "ZO";
//     G: "GO";
//   };
//   Z: {
//     K: "ZK";
//     H: "ZH";
//     O: "ZO";
//   };
//   L: {
//     U: "UL";
//     H: "LH";
//     O: "LO";
//   };
//   K: {
//     Z: "ZK";
//     H: "KH";
//     O: "KO";
//   };
//   G: {
//     H: "GH";
//     O: "GO";
//   };
//   U: {
//     L: "UL";
//     H: "UH";
//     O: "UO";
//   };
//   OH: {
//     UH: "UH2O";
//     UO: "UHO2";
//     ZH: "ZH2O";
//     ZO: "ZHO2";
//     KH: "KH2O";
//     KO: "KHO2";
//     LH: "LH2O";
//     LO: "LHO2";
//     GH: "GH2O";
//     GO: "GHO2";
//   };
//   X: {
//     UH2O: "XUH2O";
//     UHO2: "XUHO2";
//     LH2O: "XLH2O";
//     LHO2: "XLHO2";
//     KH2O: "XKH2O";
//     KHO2: "XKHO2";
//     ZH2O: "XZH2O";
//     ZHO2: "XZHO2";
//     GH2O: "XGH2O";
//     GHO2: "XGHO2";
//   };
//   ZK: {
//     UL: "G";
//   };
//   UL: {
//     ZK: "G";
//   };
//   LH: {
//     OH: "LH2O";
//   };
//   ZH: {
//     OH: "ZH2O";
//   };
//   GH: {
//     OH: "GH2O";
//   };
//   KH: {
//     OH: "KH2O";
//   };
//   UH: {
//     OH: "UH2O";
//   };
//   LO: {
//     OH: "LHO2";
//   };
//   ZO: {
//     OH: "ZHO2";
//   };
//   KO: {
//     OH: "KHO2";
//   };
//   UO: {
//     OH: "UHO2";
//   };
//   GO: {
//     OH: "GHO2";
//   };
//   LH2O: {
//     X: "XLH2O";
//   };
//   KH2O: {
//     X: "XKH2O";
//   };
//   ZH2O: {
//     X: "XZH2O";
//   };
//   UH2O: {
//     X: "XUH2O";
//   };
//   GH2O: {
//     X: "XGH2O";
//   };
//   LHO2: {
//     X: "XLHO2";
//   };
//   UHO2: {
//     X: "XUHO2";
//   };
//   KHO2: {
//     X: "XKHO2";
//   };
//   ZHO2: {
//     X: "XZHO2";
//   };
//   GHO2: {
//     X: "XGHO2";
//   };
// };



// type OfficialReactionRecipe = typeof REACTIONS




// /**
//  * lab
//  * 
//  * REACTIONS 的结构为：
//  * {
//  *    原料1: 
//  *    {
//  *      原料2: 产物
//  *    }
//  * }
//  * 
//  * 我们从中反推出产物所需原料
//  */

type Tier3MineralCompoundConstant =
  | RESOURCE_CATALYZED_GHODIUM_ACID
  | RESOURCE_CATALYZED_GHODIUM_ALKALIDE
  | RESOURCE_CATALYZED_KEANIUM_ACID
  | RESOURCE_CATALYZED_KEANIUM_ALKALIDE
  | RESOURCE_CATALYZED_LEMERGIUM_ACID
  | RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE
  | RESOURCE_CATALYZED_UTRIUM_ACID
  | RESOURCE_CATALYZED_UTRIUM_ALKALIDE
  | RESOURCE_CATALYZED_ZYNTHIUM_ACID
  | RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE



export type LabMaterialConstant = Exclude<MineralConstant | MineralCompoundConstant, Tier3MineralCompoundConstant>

const _REACTIONS = REACTIONS as Record<LabMaterialConstant, Record<LabMaterialConstant, MineralCompoundConstant>>



export const RECIPES_LAB = Object.entries(_REACTIONS).reduce((acc, [key, value]) => {
  Object.entries(value).forEach(([key2, value2]) => {
    acc[value2] = [key, key2] as [LabMaterialConstant, LabMaterialConstant]
  })
  return acc
}, {} as Record<MineralCompoundConstant, [LabMaterialConstant, LabMaterialConstant]>)











/**
 * factory
 * 
 * COMMODITIES 的结构为：
 * declare const COMMODITIES: Record<
 *     CommodityConstant | MineralConstant | RESOURCE_GHODIUM,
 *     {
 *         amount: number,
 *         cooldown: number,
 *         components: Record<DepositConstant | CommodityConstant | MineralConstant | RESOURCE_GHODIUM, number>,
 *     }
 * >,
 * 
 */
