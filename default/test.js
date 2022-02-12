const { memoryResources, memoryUpgradePosArray } = require('./util_getMemories')

function transferEnergyToContainer(creep) {

  console.time('t1')
  let containers = creep.room.find(FIND_STRUCTURES, { filter: s.structureType == StructureContainer })
  creep.pos.findClosestByPath(containers, { filter: s.structureType == StructureContainer })
  console.timeEnd('t1')
}

function transferEnergyToContainer2(creep) {
  console.time('t2')
  creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: s.structureType == StructureContainer })
  console.timeEnd('t2')
}




let test = {
  memoryUpgradePosArray: memoryUpgradePosArray,

  trans1: transferEnergyToContainer,

  trans2: transferEnergyToContainer2

}



module.exports = test