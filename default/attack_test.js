
const attack_moveToFlag = (creep, flag) => {

  creep.moveTo(flag)
}

const attack_attackAtFlag = (creep, flag) => {

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

function main() {

  let attackerCreepsId = ['attackerTest', 'attackerTest2']
  let flagID = 'Flag1'


  let flag = Game.flags[flagID]

  for (i in attackerCreepsId) {
    let c = Game.creeps[attackerCreepsId[i]]



    attack_moveToFlag(c,flag)
    attack_objectByID(c,'62000f0f1386917f30c19f13')
    // attack_anyCreep(c)
    // attack_STRUCTURES(c)

  }

  // attack_moveToFlag(Game.creeps['attackerTest2'], Game.flags['Flag1'])
}

module.exports = main

