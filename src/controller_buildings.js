import { config } from './util_consts'
import Tower from './building_tower'
import Link from './building_link'
import Factory from './building_factory'
import PowerSpawn from './building_powerSpawn'
import Spawn from './building_spawn'
import Lab from './building_lab'
import Observer from './building_observer'


const SHOW_CPU_BUILDINGS = config.SHOW_CPU_BUILDINGS

function controller_buildings() {

  let CPUcounts = []

  for (const s of Object.values(Game.structures)) {

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

export default controller_buildings;

