//所有visuals的入口

// import { getCPUCost } from "./util_helper"
// import roleTagger from "./visuals_roleTagger"
import roomBuildingPlanner from "./visuals_roomBuildingPlanner"
import { showRoomRoleCounts } from "./visuals_roomRoleCounts"
import { showRoomSpawnQueue } from "./visuals_roomSpawnQueue"
import worldVisual_showMineralMap from "./visuals_world_showMineralMap"

const showVisuals = () => {

  //显示visuals
  showRoomSpawnQueue()
  showRoomRoleCounts()

  // roleTagger('W12N16')
  // roleTagger('W11N16')

  roomBuildingPlanner('develop_W21N14')



  //! ////////////// WORLD VISUALS ////////////////
  worldVisual_showMineralMap()
}

export default showVisuals