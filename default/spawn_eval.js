
const evaluNumber = (roomName) => {

  //每过多久才评估一次

  let room = Game.rooms[roomName]
  if (!room) {
    console.log(`DO NOT have vision of ${roomName} : ealuNUmber`)
    return
  }


  let number_builder = 0,
    number_upgrader = 0,
    number_carrier = 0,
    number_harvester = 0,
    number_miner = 0;

  //* Builder

  if (_.isUndefined(room.memory.ConstructionSites)) {
    room.memory.ConstructionSites = room.find(FIND_CONSTRUCTION_SITES)
  }

  //每50tick重寻一次
  if (Game.time % 50 == 0) {
    room.memory.ConstructionSites = room.find(FIND_CONSTRUCTION_SITES)
  }

  let CSs = room.memory.ConstructionSites
  let progressNeeded = 0
  if (CSs.length > 0) {
    for (c of CSs) {
      progressNeeded += c.progressTotal - c.progress
    }
  }

  if (progressNeeded <= 10 * 1000) {
    number_builder = 1
  } else if (progressNeeded > 10 * 1000 && progressNeeded <= 100 * 1000) {
    number_builder = 2
  } else if (progressNeeded > 100 * 1000) {
    number_builder = 3
  }


  //* Harvester

  if (_.isUndefined(room.memory.Sources)) {
    room.memory.Sources = room.find(FIND_SOURCES)
  }
  number_harvester = room.memory.Sources.length



  let ret = {
    builder: number_builder,
    carrier: number_carrier,
    harvester: number_harvester,
    miner: number_miner,
    upgrader: number_upgrader
  }
  return ret

}


const evaluBody = (roomName, type) => {

}


const spawnQueue_push = (roomName, roleToPush) => {
  let room = Game.rooms[roomName]

  if (_.isUndefined(room.memory.spawnQueue)) {
    room.memory.spawnQueue = []
  }
  let queue = room.memory.spawnQueue

  let index = _.findIndex(queue, i => weight.get(i) > weight.get(roleToPush))
  if (index === -1) {
    queue.push(roleToPush)
  } else {
    queue.splice(index, 0, roleToPush)
  }


}

const spawnQueue_sort = (roomName, weight = undefined) => {
  let room = Game.rooms[roomName]

  if (_.isUndefined(room.memory.spawnQueue)) {
    room.memory.spawnQueue = []
  }

  // let queue = [...room.memory.spawnQueue]
  let sorted = []
  if (!weight) {
    let weight = new Map()
    weight.set('harvester', 100)
    weight.set('carrier', 90)
    weight.set('builder', 80)
    weight.set('repairer', 75)
    weight.set('miner', 20)
    weight.set('upgrader', 10)
  }


  _.sortBy(room.memory.spawnQueue, i => weight.get(i))


  // room.memory.spawnQueue = sorted

}


/**
 * 按照评估的数量，补全creep至spawn队列
 * @param {String}} roomName
 */
const pushByDiff = (roomName) => {
  let room = Game.rooms[roomName]
  if (!room) {

  }

  let RM = room.memory

  let neededCounts = evaluNumber(roomName)

  let creeps = _.filter(Game.creeps, c => c.memory.spawnRoom === roomName)


  let roleCounts = {}

  let harvester = 'harvester'
  let builder = 'builder'
  let upgrader = 'upgrader'
  let miner = 'miner'
  let carrier = 'carrier'

  for (c of creeps) {
    if (_.startsWith(c, harvester)) {
      if (_.isUndefined(roleCounts[harvester])) {
        roleCounts[harvester] = 1
      } else { roleCounts[harvester] += 1 }
    }
    if (_.startsWith(c, builder)) {
      if (_.isUndefined(roleCounts[builder])) {
        roleCounts[builder] = 1
      } else { roleCounts[builder] += 1 }
    }
    if (_.startsWith(c, upgrader)) {
      if (_.isUndefined(roleCounts[upgrader])) {
        roleCounts[upgrader] = 1
      } else { roleCounts[upgrader] += 1 }
    }
    if (_.startsWith(c, miner)) {
      if (_.isUndefined(roleCounts[miner])) {
        roleCounts[miner] = 1
      } else { roleCounts[miner] += 1 }
    }
    if (_.startsWith(c, carrier)) {
      if (_.isUndefined(roleCounts[carrier])) {
        roleCounts[carrier] = 1
      } else { roleCounts[carrier] += 1 }
    }

  }


  //对比差值，push入spawn队列
  for (let role in neededCounts) {
    let diff = neededCounts[role] - roleCounts[role]
    while (diff > 0) {
      spawnQueue_push(roomName, role)
      // RM.spawnQueue.push(diff)
      diff -= 1
    }

  }
  // spawnQueue_sort(roomName)

}

module.exports = evaluNumber