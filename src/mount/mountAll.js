import mountSimpleDuichuan from "./creeps/Mofeng极简对穿";
import mountSpawnQueue from "./common/proto_spawnQueue";
import mountCLI from "./cli/cli";
import mountWhiteList from "./common/whitelist";

import mountCreep from "./creeps/proto_creep";

import findCache from "./common/util_cache_find"

import customPrototypes from './common/util_customPrototypes'
import { mountTransportTaskCenter } from "@/tasks/transport/mount";

export const mountAll = () => {

  findCache();
  customPrototypes()

  mountCLI();
  mountSimpleDuichuan()
  mountWhiteList()

  mountCreep()

  mountSpawnQueue()

  mountTransportTaskCenter()

}

