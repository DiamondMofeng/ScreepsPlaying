import mountSimpleDuichuan from "./creeps/Mofeng极简对穿";
import mountSpawnQueue from "./common/proto_spawnQueue";
import mountCLI from "./cli/cli";
import mountWhiteList from "./common/whitelist";

import mountCreep from "./creeps/proto_creep";

import { mountStructureCache } from "./common/cache_structures"

import { mountStructurePrototypes } from './common/customStructurePrototypes'
import { mountTransportTaskCenter } from "@/tasks/transport/mount";

export const mountAll = () => {

  mountStructureCache();
  mountStructurePrototypes()

  mountCLI();
  mountSimpleDuichuan()
  mountWhiteList()

  mountCreep()

  mountSpawnQueue()

  mountTransportTaskCenter()

}

