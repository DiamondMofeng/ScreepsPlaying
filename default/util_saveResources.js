const memoryResourves = (anyObjectHasMemory) => {
  const obj = anyObjectHasMemory
  //add memory
  if (!obj.room.memory.sources || obj.room.memory.sources.length == 0) {
    obj.room.memory.sources = []
    const sources = obj.room.find(FIND_SOURCES)


    const workPos = (source) => {
      
      if (source.id == '5bbcac3c9099fc012e635233')
        return new RoomPosition(9, 37, 'W12N16')
      if (source.id == '5bbcac3c9099fc012e635232')
        return new RoomPosition(21, 31, 'W12N16')
      
    }


    for (i in sources) {

      const s = sources[i]
      obj.room.memory.sources[s.id] = {
        id: s.id,
        workPos: workPos(s),
        onHarvest: false,
        harvester: ''
      }
    }
  }
}

module.exports = memoryResourves;