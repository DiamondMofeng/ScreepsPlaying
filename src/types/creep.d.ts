type CreepRole =
  | 'harvester'
  | 'harvesterPlus'
  | 'carrier'
  | 'base_transferor'
  | 'upgrader'
  | 'builder'
  | 'repairer'
  | 'sweepper'
  | 'remote_carrier'
  | 'remote_claimer'
  | 'remote_harvester'
  | 'useless'
  | 'guardian'
  | 'roomClaimer'
  | 'miner'
  | 'expend_builder'
  | 'expend_claimer'
  | 'wallRepairer'
  | 'scavenger'

  | 'task_transporter'

// interface Creep extends RoomObject {
//   memory: CreepMemory;
// }

interface CreepMemory {
  role?: CreepRole;
  '_PS_ID'?: Id<StructurePowerSpawn>;
  '_FACTORY_ID'?: Id<StructureFactory>;
  // task?: BasicTask;
}



