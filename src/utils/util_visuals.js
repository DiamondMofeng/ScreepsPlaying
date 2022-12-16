//所有visuals的入口

// import { getCPUCost } from "@/utils/util_helper"
// import roleTagger from "./visuals_roleTagger"
import roomBuildingPlanner from "./visual/visuals_roomBuildingPlanner"
import { showRoomRoleCounts } from "./visual/visuals_roomRoleCounts"
import { showRoomSpawnQueue } from "./visual/visuals_roomSpawnQueue"
import worldVisual_showMineralMap from "./visual/visuals_world_showMineralMap"

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