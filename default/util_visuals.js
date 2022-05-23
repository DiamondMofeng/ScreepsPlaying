//所有visuals的入口

const { getCPUCost } = require("./util_helper")
const roleTagger = require("./visuals_roleTagger")
const roomBuildingPlanner = require("./visuals_roomBuildingPlanner")
const { showRoomRoleCounts } = require("./visuals_roomRoleCounts")
const { showRoomSpawnQueue } = require("./visuals_roomSpawnQueue")
const worldVisual_showMineralMap = require("./visuals_world_showMineralMap")

const showVisuals = () => {

  //显示visuals
  showRoomSpawnQueue()
  showRoomRoleCounts()

  // roleTagger('W12N16')
  // roleTagger('W11N16')

  // roomBuildingPlanner('expend1')



  //! ////////////// WORLD VISUALS ////////////////
  worldVisual_showMineralMap()
}

module.exports = showVisuals