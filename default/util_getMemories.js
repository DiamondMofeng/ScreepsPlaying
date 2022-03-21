


const memoryResources = (roomName, timer = true) => {



  //间隔一段时间才执行
  if (timer == true) {
    if (Game.time % 30 !== 0)
      return
  }


  //add memory

  let room = Game.rooms[roomName]
  //给room的Memory添加各种常用建筑，除了terminal,storage,controll
  // spawn

  let RM = room.memory


  let Structures = room.find(FIND_STRUCTURES,
    {
      filter: s => s.structureType !== STRUCTURE_WALL
        && s.structureType !== STRUCTURE_RAMPART
        && s.structureType !== STRUCTURE_EXTENSION
    })

  let Sources = {}
  let StructureContainers = {}
  let StructureLinks = {}
  let StructureSpawns = {}
  let StructureLabs = {}


  // //* StructureContainer
  // let containers = Structures.filter(s => s.structureType === STRUCTURE_CONTAINER)
  // for (c of containers) {
  //   //确定type:source,?mine,?spawn,controller,other
  //   //确定？
  //   let type = 'unknow'

  //   let sources = room.find(FIND_SOURCES)
  //   for (s of sources) {
  //     if (c.pos.inRangeTo(s, 1) == true) {
  //       type = 'source'
  //       break
  //     }
  //   }




  //   StructureContainers[c.id] = { type: type }
  // }

  // //* SAVE
  // RM.StructureContainers = StructureContainers






  if (!room.memory.sources || Object.keys(room.memory.sources).length == 0) {

    console.log(`Memorizing resources info at ${room}`)

    room.memory.sources = {}
    const sources = room.find(FIND_SOURCES)


    const workPos = (source) => {

      if (source.id == '5bbcac3c9099fc012e635233')
        return new RoomPosition(9, 37, 'W12N16')
      if (source.id == '5bbcac3c9099fc012e635232')
        return new RoomPosition(21, 31, 'W12N16')

    }

    for (s of sources) {

      // const s = sources[i]
      room.memory.sources[s.id] = {
        id: s.id,
        workPos: workPos(s),
        onHarvest: false,
        harvester: ''
      }
    }
  }
}


const memoryUpgradePosArray = (room) => {
  //upgradePos
  if (!room.memory.upgradePos || room.memory.upgradePos.length == 0) {
    room.memory.upgradePos = []
    // console.log(room.find(StructureController))
    let controller = room.controller;

    if (controller.id === '5bbcac3c9099fc012e635234') {
      room.memory.upgradePos = [{ x: 42, y: 41, used: false },
      { x: 41, y: 41, used: false },
      { x: 40, y: 41, used: false },
      { x: 42, y: 40, used: false },
      { x: 41, y: 40, used: false },
      // { x: 40, y: 40', used:false },//为carrier保留
      { x: 41, y: 40, used: false },
      { x: 40, y: 40, used: false }
        // { x: '40', y: '38', used=false }  //最左上，但是碰不到container
      ]
    }
  }
}


// const { memoryResources, memoryUpgradePosArray } = require('./util_getMemories')

module.exports = {
  memoryResources,
  memoryUpgradePosArray
}