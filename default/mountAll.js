const mountSimpleDuichuan = require("./Mofeng极简对穿");
const mountCLI = require("./util_cli");
const mountWhiteList = require("./util_whiteList");

const mountAll = () => {

  mountCLI();
  mountSimpleDuichuan()
  mountWhiteList()

}

module.exports = mountAll