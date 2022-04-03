const { moveToRoom } = require("./util_beheavor")
const { avoidSourceKeeper } = require("./util_costCallBacks")

/**
 * pionner将前往flag所在房间，采集资源并进行建造
 * @param {Creep} creep - 
 */
const role_roomClaimer = (creep) => {

  if (creep.getActiveBodyparts(HEAL) > 0) {
    creep.heal(creep)
  }

  if (creep.memory.manual === true) {
    let flagName = ''
    let targetRoom = ''
    creep.moveTo(Game.flags[creep.memory.flagName], { reusePath: 50, costCallback: avoidSourceKeeper })
    return
  }
  else {

    let workRoom = creep.memory.workRoom
    if (creep.room.name !== workRoom) {
      moveToRoom(creep, workRoom, true, true)
    }

    else if (creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.room.controller, { reusePath: 50 })
    }
  }


}

//8*work,4*CARRY,13*MOVE,1*HEAL 250+800+850
//Game.spawns.Spawn1.spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,HEAL],'c2',{memory:{role:'roomClaimer'},manual:true})
module.exports = role_roomClaimer

