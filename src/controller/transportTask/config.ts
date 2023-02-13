import type { TransportTaskBaseName } from "@/tasks/transport/types"
import type { PartialRecord } from "@/utils/util-types"

type Config = {
  limit: number
  interval: number
  weight: number
}

export const transportTaskConfig = {


  // 日常填充能量
  'fill_extension': {
    weight: 90,

    limit: 2,
    interval: 50,
  },

  'fill_tower': {
    weight: 100,

    limit: 1,
    interval: 50,
  },


  'fill_lab_energy': {
    weight: 20,

    limit: 1,
    interval: 100,
  },

  //lab 
  'fill_lab': {
    weight: 100,

    limit: 1,
    interval: 100,
  },

  'harvest_lab': {
    weight: 100,

    limit: 1,
    interval: 100,
  },

  //factory
  'fill_factory': {
    weight: 100,

    limit: 1,
    interval: 500,
  },

  //container
  'dump_container': {
    weight: 100,

    limit: 2,
    interval: 100,
  },

} satisfies PartialRecord<TransportTaskBaseName, Config>