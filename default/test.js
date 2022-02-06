const saveResourves = (anyObjectHasMemory) => {
  const obj = anyObjectHasMemory
  // let obj.room.memory.source = obj.room.memory.source
  // console.log('array:',energySourceList)
  //add memory
  if (!obj.room.memory.source || obj.room.memory.source.length == 0) {
    obj.room.memory.source = []
    const sources = obj.room.find(FIND_SOURCES)
    for (i in sources) {

      const source = sources[i]
      // console.log('source1', source)
      // console.log('source1id', source.id)
      obj.room.memory.source[i] = {
        id: source.id,
        // pos: source.pos,
        onHarvest: false,
        miner: ''
      }
    }
  }
}

module.exports = saveResourves;