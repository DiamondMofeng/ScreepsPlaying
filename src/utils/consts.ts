import { PartialRecord } from "./util-types"


export const SPAWN_PRIOTITY: PartialRecord<CreepRole, number> = {
  harvester: 95,
  carrier: 100,
  upgrader: 50,
  builder: 40,
  repairer: 45,
  miner: 10,
  base_transferor: 60,
}

export const config = {
  SHOW_CPU_CREEPS: false,
  SHOW_CPU_BUILDINGS: false,
}

export const TIME_INTERVAL = {
  COUNT_CREEPS: 10,
  WALL_REPAIRER_RESELECT_TARGET: 500,
  TOWER_REPIRE: 5,
}

const C = {

  config,

  TIME_INTERVAL,

  SPAWN_PRIOTITY,

  myName: 'Mofeng',

  RM: {
    CONTAINERS: 'containers',
    LINKS: 'link',

    SPAWN_QUEUE: 'spawnQueue',
  },

  IGNORE_CREEPS: true

}

export default C