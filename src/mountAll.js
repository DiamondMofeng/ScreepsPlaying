import mountSimpleDuichuan from "./Mofeng极简对穿";
import mountSpawnQueue from "./proto_spawnQueue";
import mountCLI from "@/utils/util_cli";
import mountWhiteList from "@/utils/util_whiteList";

import mountCreep from "./proto_creep";
import mountTaskCenter from "./task_taskCenter";

const mountAll = () => {

  mountCLI();
  mountSimpleDuichuan()
  mountWhiteList()

  mountCreep()

  mountSpawnQueue()

  mountTaskCenter()


}

export default mountAll