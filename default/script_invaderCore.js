const { moveToRoom } = require("./util_beheavor")
const { body, spawnByMinNumber } = require("./util_helper")

const cleanInvaderCore = (invaderRoom, spawnRoom) => {

  if (!Game.rooms[invaderRoom].controller.reservation || Game.rooms[invaderRoom].controller.reservation.username !== 'Invader') {


    return
  }
  console.log('cleaning invaderCore of room' + invaderRoom);
  //!
  let spawnName = 'W17N15_0'
  let spawn = Game.spawns.W17N15_0
  //!


  let flagPos = new RoomPosition(25, 25, invaderRoom)
  let flagName = 'CleanInvaderCore-' + invaderRoom
  flagPos.createFlag(flagName)
  let flag = Game.flags[flagName]
  if (_.isUndefined(flag.memory.attackers)) {
    flag.memory.attackers = []
  }

  let creepName = 'incaderCleaner' + invaderRoom + Game.time

  let result = spawnByMinNumber(spawnName, 'incaderCleaner', body([ATTACK, 10, MOVE, 10]), 1)
  if (result.spawnResult === OK) {
    if (_.isUndefined(flag.memory.attackers)) {
      flag.memory.attackers = []
    }
    flag.memory.attackers.push(creepName)
  }

  if (flag.memory.attackers.length > 0) {
    for (i in flag.memory.attackers) {

      let a = flag.memory.attackers[i];

      if (Object.keys(Game.creeps).indexOf(a) == -1) {
        flag.memory.attackers.splice(i, 1)
      }

      let attacker = Game.creeps[a]

      moveToRoom(attacker, invaderRoom, true);

      let invaderCore = attacker.room.find(FIND_STRUCTURES, { filter: s => s.structureType === STRUCTURE_INVADER_CORE })[0]

      let attackResult = attacker.attack(invaderCore)
      if (attackResult == ERR_NOT_IN_RANGE) {
        attacker.moveTo(invaderCore, { reusePath: 50 })
      }
    }



  }

}

module.exports = { cleanInvaderCore }