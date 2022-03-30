const Harvester = require('./role_harvester')
const HarvesterPlus = require('./role_harvesterPlus')
const Carrier = require('./role_carrier')
const Upgrader = require('./role_upgrader')
// const Upgrader = require('./role_upgraderPlus')
const Builder = require('./role_builder')
const Repairer = require('./role_repairer')
const Sweepper = require('./role_sweepper')

// const long_Pionner = require('./role_long_pioneer')
// const long_Reserver = require('./role_long_reserver')
// const long_Carrier = require('./role_long_carrier')
// const long_Harvester = require('./role_long_harvester')

const base_Transferor = require('./role_base_transferor')

// const remote_builder=
const remote_Carrier = require('./role_remote_carrier')
const remote_Claimer = require('./role_remote_claimer')
const remote_Harvester = require('./role_remote_harvester')

const Useless = require('./role_useless')

const Guardian = require('./role_guardian')

const RoomClaimer = require('./role_roomClaimer')


const Miner = require('./role_miner')


const { startWith } = require('./util_helper')
const role_expend_builder = require('./role_expend_builder')
const role_expend_claimer = require('./role_expend_claimer')
const role_scavenger = require('./role_scavenger')
const powerCreep_new = require('./powerCreep_new')




//* functions////////////////////////////////




//! script_outerEnergyBase中存在对 pionner_leader 和 remoteBuilder 的控制！

function controller_creeps() {


  let CPUcounts = []

  powerCreep_new()

  //* beheavor crontroller
  for (creepName in Game.creeps) {
    try {


      let startCPU = Game.cpu.getUsed()


      var creep = Game.creeps[creepName]

      if (!creep.memory.role) {
        continue
      }


      if (startWith(creep.memory.role, 'harvester')) {

        if (startWith(creep.memory.role, 'harvesterPlus')) {
          HarvesterPlus(creep)

        } else { Harvester(creep) }
      }

      if (startWith(creep.memory.role, 'carrier')) {
        //   Harvester(creep)
        Carrier(creep)
      }
      if (startWith(creep.memory.role, 'builder')) {
        Builder(creep)
      }
      if (startWith(creep.memory.role, 'upgrader')) {
        Upgrader(creep)
        // Builder(creep)
      }
      if (startWith(creep.memory.role, 'repairer')) {
        Repairer(creep)
        // Builder(creep)
        // Harvester(creep)
      }
      if (startWith(creep.memory.role, 'sweepper')) {
        Sweepper(creep)
      }




      /*
      //! //////LONG/////////
      if (startWith(creep.memory.role, 'long_pionner')) {
        long_Pionner(creep, 'out')
      }

      if (startWith(creep.memory.role, 'long_reserver')) {
        long_Reserver(creep, 'out')
      }

      if (startWith(creep.memory.role, 'long_carrier')) {
        // long_Carrier(creep, Game.getObjectById('6200bf0e9b3fe1ad6927628f'), Game.getObjectById('6200bf0e9b3fe1ad6927628f'))
        long_Carrier(creep
          , '6204d67b3a03e2154eb99bde'
          , '620b405774b79b735e8dcaa4') // normal

      }

      if (startWith(creep.memory.role, 'long_harvester')) {
        // console.log('Game.getObjectById(): ', Game.getObjectById('5bbcac4a9099fc012e6353bc'));
        long_Harvester(creep
          , '6204d67b3a03e2154eb99bde'//container
          , '5bbcac4a9099fc012e6353bc'//source

        )
      }
    */
      //! BASE//////////////

      if (startWith(creep.memory.role, 'base_transferor')) {
        // console.log('Game.getObjectById(): ', Game.getObjectById('5bbcac4a9099fc012e6353bc'));
        base_Transferor(creep)
      }



      //! ///////////Remote///////////
      // if (startWith(creep.memory.role, '123')) {
      //   Useless(creep)
      // }
      // if (startWith(creep.memory.role, 'useless')) {
      //   Useless(creep)
      // }
      if (startWith(creep.memory.role, 'remote_claimer')) {
        remote_Claimer(creep)
      }
      if (startWith(creep.memory.role, 'remote_harvester')) {
        remote_Harvester(creep)
      }
      if (startWith(creep.memory.role, 'remote_carrier')) {
        remote_Carrier(creep)
      }
      //! ///////////other////////////

      if (startWith(creep.memory.role, 'useless')) {
        Useless(creep)
      }

      if (startWith(creep.memory.role, 'guardian')) {
        Guardian(creep)
      }

      if (startWith(creep.memory.role, 'roomClaimer')) {
        RoomClaimer(creep)
      }
      //! ///////// after LV6 ///////

      if (startWith(creep.memory.role, 'miner')) {
        Miner(creep)
      }


      //! //////// expend //////////
      if (startWith(creep.memory.role, 'expend_builder')) {
        role_expend_builder(creep)
      }
      if (startWith(creep.memory.role, 'expend_claimer')) {
        role_expend_claimer(creep)
      }



      //! 临时
      if (startWith(creep.memory.role, 'scavenger')) {
        role_scavenger(creep)
      }


      ////  ///////temp for other room/////

      let endCPU = Game.cpu.getUsed()

      CPUcounts.push({ creep: creep.name, cpu: endCPU - startCPU })

    } catch (e) {
      console.log('!!!!!!!!!ERROR FOUND IN ' + creep + ' CONTROLL!!!!!!' + e)
      console.log(e.stack)
    }
  }

  // CPUcounts.sort((a, b) => a.cpu - b.cpu)
  // _.forEach(CPUcounts, i => console.log(`CPU of ${i.creep}:   ${i.cpu}`))


  // console.log('1')
}

module.exports = controller_creeps;

