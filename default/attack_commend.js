
const attack_moveToFlag = (creep, flagID) => {
  let flag = Game.flags[flagID]
  creep.moveTo(flag)
}

function attack_anyCreep(creep) {
  let targets = creep.room.find(FIND_HOSTILE_CREEPS)

  if (creep.attack(targets[targets.length - 1]) == ERR_NOT_IN_RANGE) {
    creep.moveTo(targets[targets.length - 1], { visualizePathStyle: { stroke: '#DC143C', opacity: 0.9 } })
  }

}

function attack_STRUCTURES(creep) {
  let targets = creep.room.find(FIND_HOSTILE_STRUCTURES, {
    filter: s => (s.structureType == STRUCTURE_TOWER
      || s.structureType == STRUCTURE_SPAWN
      || s.structureType == STRUCTURE_EXTENSION
      || s.structureType == STRUCTURE_CONTAINER
    )
  })

  let atkResult = creep.attack(targets[targets.length - 1])

  // console.log(atkResult)

  if (atkResult == ERR_NOT_IN_RANGE) {
    creep.moveTo(targets[targets.length - 1], { visualizePathStyle: { stroke: '#DC143C', opacity: 0.9 } })
  }
}

function attack_objectByID(creep, id) {
  creep.attack(Game.getObjectById(id))
}

function attack_moveToFlagRoom(creep, flagID) {
  let flag = Game.flags[flagID]

  if (creep.room !== flag.room) {
    creep.moveTo(flag)

  }
}


function main() {

  let attackerCreepsId = ['attacker1']
  let flagID = 'ATK'


  let flag = Game.flags[flagID]

  for (i in attackerCreepsId) {
    let c = Game.creeps[attackerCreepsId[i]]

    if (_.isUndefined(c)) continue




    // attack_moveToFlagRoom(c, flag)

    attack_moveToFlag(c, 'ATK')
    attack_objectByID(c, '6207cb993532724bae271722')
    // attack_anyCreep(c)
    // attack_STRUCTURES(c)

  }

  // attack_moveToFlag(Game.creeps['attackerTest2'], Game.flags['Flag1'])
}


// Game.spawns.Spawn1.spawnCreep([TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE], 'attacker1')
//Game.spawns.Spawn1.spawnCreep([TOUGH, TOUGH, MOVE,TOUGH, TOUGH, MOVE,TOUGH, TOUGH, MOVE, TOUGH, ATTACK,  MOVE,ATTACK, ATTACK,  MOVE,ATTACK, ATTACK,  MOVE], 'attacker1')

module.exports = main

