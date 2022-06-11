const Tower = require('./building_tower')
const Link = require('./building_link')
const Factory = require('./building_factory')
const PowerSpawn = require('./building_powerSpawn')
const Spawn = require('./building_spawn')
const Lab = require('./building_lab')
const C = require('./util_consts')
const Observer = require('./building_observer')


const SHOW_CPU_BUILDINGS = C.config.SHOW_CPU_BUILDINGS

function controller_buildings() {

  let CPUcounts = []

  for (s of Object.values(Game.structures)) {

    try {

      let startCPU = Game.cpu.getUsed()

      switch (s.structureType) {
        case STRUCTURE_TOWER:
          Tower(s)
          break
        case STRUCTURE_LINK:
          Link(s)
          break
        case STRUCTURE_FACTORY:
          Factory(s)
          break
        case STRUCTURE_SPAWN:
          Spawn(s)
          break
        case STRUCTURE_POWER_SPAWN:
          PowerSpawn(s)
          break
        case STRUCTURE_LAB:
          Lab(s)
          break
        case STRUCTURE_OBSERVER:
          Observer(s)
          break
        default:
          continue
      }

      let endCPU = Game.cpu.getUsed()

      if (SHOW_CPU_BUILDINGS) {
        CPUcounts.push({ structureType: s.structureType, cpu: endCPU - startCPU, roomName: s.room.name })
        // console.log(`CPU of ${s.structureType} at ${s.room.name} : ${endCPU - startCPU}`)
      }


      // if (s.structureType == STRUCTURE_TOWER) {
      //   Tower(s)
      // }
      // if (s.structureType == STRUCTURE_LINK) {
      //   Link(s)
      // }
      // // if (s.structureType == STRUCTURE_TERMINAL) {
      // //   Terminnal(s)
      // // }
      // if (s.structureType == STRUCTURE_FACTORY) {
      //   Factory(s)
      // }
      // // if (s.structureType == STRUCTURE_TOWER) {
      // //   Tower(s)
      // // }
      // if (s.structureType == STRUCTURE_POWER_SPAWN) {
      //   PowerSpawn(s)
      // }
    }
    catch (e) {
      console.log('!!!!!!!!!!!!ERROR FOUND IN ' + s + ' CONTROLL!!!!!!!!!' + e)
      console.log(e.stack)

    }

  }
  if (SHOW_CPU_BUILDINGS) {
    CPUcounts.sort((a, b) => a.cpu - b.cpu)
    CPUcounts.forEach(i => console.log(`CPU of ${i.structureType} at ${i.roomName} : ${i.cpu}`))
  }

}

module.exports = controller_buildings;

