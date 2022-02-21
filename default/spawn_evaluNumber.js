
const evaluNumber = (roomName) => {

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



}

module.exports = evaluNumber