const Tower = require('./building_tower')
const Link = require('./building_link')
const Factory = require('./building_factory')
const PowerSpawn = require('./building_powerSpawn')
const Spawn = require('./building_spawn')


const IS_SHOW_CPU = false

function controller_buildings() {

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
        default:
          continue
      }

      let endCPU = Game.cpu.getUsed()

      if (IS_SHOW_CPU) {
        console.log(`${s.structureType} ${s.id} ${endCPU - startCPU}`)
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
}

module.exports = controller_buildings;

