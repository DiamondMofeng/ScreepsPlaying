import { config } from '@/utils/consts'

import { runTower } from './structures/tower/tower'
import { runLink } from './structures/link/link'
import { runFactory } from './structures/factory'
import { runPowerSpawn } from './structures/powerSpawn'
import { runSpawn } from './structures/spawn'
import { runLab } from './structures/lab/lab'
import { runObserver } from './structures/observer'
// import { runTerminal } from './structures/terminal'

const SHOW_CPU_BUILDINGS = config.SHOW_CPU_BUILDINGS

type AnyPlayerOwnedStructure = Exclude<AnyOwnedStructure, StructureKeeperLair | StructureInvaderCore | StructurePowerBank>

// const ControlledStrctureTypes = [STRUCTURE_TOWER, STRUCTURE_LINK, STRUCTURE_FACTORY, STRUCTURE_SPAWN, STRUCTURE_POWER_SPAWN, STRUCTURE_LAB, STRUCTURE_OBSERVER] as const

function controller_structures() {

  let CPUcounts = []

  for (const s of Object.values(Game.structures) as AnyPlayerOwnedStructure[]) {  // it should be AnyOwnedStructure

    try {

      let startCPU = Game.cpu.getUsed()

      switch (s.structureType) {
        case STRUCTURE_TOWER:
          runTower(s)
          break
        case STRUCTURE_LINK:
          runLink(s)
          break
        case STRUCTURE_FACTORY:
          runFactory(s)
          break
        case STRUCTURE_SPAWN:
          runSpawn(s)
          break
        case STRUCTURE_POWER_SPAWN:
          runPowerSpawn(s)
          break
        case STRUCTURE_LAB:
          runLab(s)
          break
        case STRUCTURE_OBSERVER:
          runObserver(s)
          break
        default:
          continue
      }

      let endCPU = Game.cpu.getUsed()

      if (SHOW_CPU_BUILDINGS) {
        CPUcounts.push({ structureType: s.structureType, cpu: endCPU - startCPU, roomName: s.room.name })
        // console.log(`CPU of ${s.structureType} at ${s.room.name} : ${endCPU - startCPU}`)
      }

    }
    catch (e: any) {
      console.log('!!!!!!!!!!!!ERROR FOUND IN ' + s + ' CONTROLL!!!!!!!!!' + e)
      console.log(e.stack)

    }

  }
  if (SHOW_CPU_BUILDINGS) {
    CPUcounts.sort((a, b) => a.cpu - b.cpu)
    CPUcounts.forEach(i => console.log(`CPU of ${i.structureType} at ${i.roomName} : ${i.cpu}`))
  }

}

export default controller_structures;

