const mountSimpleDuichuan = require("./Mofeng极简对穿");
const mountSpawnQueue = require("./proto_spawnQueue");
const mountCLI = require("./util_cli");
const mountWhiteList = require("./util_whiteList");

const mountCreep = require("./proto_creep")

const mountAll = () => {

  mountCLI();
  mountSimpleDuichuan()
  mountWhiteList()

  mountCreep()

  mountSpawnQueue()


}

module.exports = mountAll