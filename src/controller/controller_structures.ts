import { config } from '@/utils/consts'

import { Tower } from './structures/tower/tower'
import { Link } from './structures/link/link'
import { Factory } from './structures/factory'
import { PowerSpawn } from './structures/powerSpawn'
import { Spawn } from './structures/spawn'
import Lab from './structures/lab/lab'
import { Observer } from './structures/observer'

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

