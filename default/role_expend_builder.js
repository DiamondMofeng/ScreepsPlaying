const { moveToRoom, tryCollectAnyEnergy, workingStatesKeeper } = require("./util_beheavor")


/**
 * 
 * @param {Creep} creep 
 * @returns 
 */
const role_expend_builder = (creep) => {

  moveToRoom(creep, creep.memory.workRoom, true);

  if (creep.room.name !== creep.memory.workRoom) {
    return
  }

  //* 已到达目标房间


  workingStatesKeeper(creep, () => tryCollectAnyEnergy(creep), () => {
    let cts = creep.room.find(FIND_CONSTRUCTION_SITES)
    if (cts.length > 0) {
      let ct = cts[0]
      if (creep.build(ct) == ERR_NOT_IN_RANGE) {
        creep.moveTo(ct, { reusePath: 50 })
      }
    }
  })


}

module.exports = role_expend_builder

