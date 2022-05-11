//所有visuals的入口

const { showRoomRoleCounts } = require("./visuals_roomRoleCounts")
const { showRoomSpawnQueue } = require("./visuals_roomSpawnQueue")

const showVisuals = () => {
  //显示visuals
  showRoomSpawnQueue()
  showRoomRoleCounts()
}

module.exports = showVisuals