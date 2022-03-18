const { evalBody_harvester, evalBody_worker_halfEnergy } = require('./spawn_evalBody');
const { memoryResources } = require('./util_getMemories')

const controller_spawns = (spawnName) => {

  let spawn = Game.spawns[spawnName]

  //show what is spawning
  if (spawn.spawning) {
    var spawningCreep = Game.creeps[spawn.spawning.name];
    spawn.room.visual.text(
      `🛠️ ${spawningCreep.memory.role} ${spawn.spawning.needTime - spawn.spawning.remainingTime}/${spawn.spawning.needTime}`,
      spawn.pos.x + 1,
      spawn.pos.y,
      { align: 'left', opacity: 0.8 });
  }

  /**
   * 输入简化版bodyArray来获取完全版
   * @param {Array} simpleBodyArray - ['part', i, ...] 应有偶数长度
   * @returns {Array} fullBodyArray
   */
  const body = (simpleBodyArray) => {
    let result = []

    for (let i = 0; i < simpleBodyArray.length; i++) {
      let PART = simpleBodyArray[i].toString()
      let next = simpleBodyArray[i + 1]

      if (typeof next == 'undefined' || typeof next == 'string') {
        result.push(PART)
        continue
      }
      else {
        if (typeof next == 'number') {
          i++
          for (; next > 0; next--) {
            result.push(PART)
          }
        }

        else throw new Error('error input of body function')
      }
    }
    return result
  }



  /**
   * 
   * @param {Array} bodyArray  - consist of PART string
   * @returns {Number} cost - cost of body
   */
  const bodyCost = (bodyArray) => {
    let cost = 0
    for (part of bodyArray) {
      switch (part) {
        case MOVE:
          cost += 50
          break
        case WORK:
          cost += 100
          break
        case CARRY:
          cost += 50
          break
        case ATTACK:
          cost += 80
          break
        case RANGED_ATTACK:
          cost += 150
          break
        case HEAL:
          cost += 250
          break
        case CLAIM:
          cost += 600
          break
        case TOUGH:
          cost += 10
          break
      }
    }
    return cost
  }



  /**
 * spawn by 对应role的最小数字
 * @param {string} spawnName 
 * @param {string} roleName 
 * @param {Array} bodyArray 
 * @param {number} minNumber 
 * @param {Object} otherMemory 
 * @memory {string} workRoom - 若不指定则默认为spawn所在房间 
 * @param {Object} options 
 * @returns TRUE if need spawn 
 */
  const spawnByMinNumber = (spawnName, roleName, bodyArray, minNumber, otherMemory = {}, options = {}) => {

    let memoryObj = {
      ...otherMemory,
      role: roleName,
      spawnName: spawnName,
      spawnRoom: Game.spawns[spawnName].room.name
    }
    if (_.isUndefined(memoryObj.workRoom)) {
      memoryObj.workRoom = memoryObj.spawnRoom
    }
    let opt = { ...options, memory: memoryObj }
    // console.log('opt: ', JSON.stringify(opt));
    let creepsSpawnAtCurRoom = _.filter(Game.creeps, (creep) => creep.memory.spawnName === spawnName)
    let currentRolerArray = _.filter(creepsSpawnAtCurRoom, (creep) => creep.memory.role == roleName);
    // console.log(roleName + ':' + currentRolerArray.length);

    if (currentRolerArray.length < minNumber) {
      var newName = roleName + Game.time;
      console.log(`Going to spawn new ${roleName} ${currentRolerArray.length + 1}/${minNumber}: ${newName} at ${spawnName} , costing energy ${bodyCost(bodyArray)} `);
      Game.spawns[spawnName].spawnCreep(bodyArray, newName, opt);
      // console.log('Game.spawns[spawnSite].spawnCreep(bodyArray, newName, opt): ', Game.spawns[spawnSite].spawnCreep(bodyArray, newName, opt));
      return true
    }
    else { return false }
  }


  // /**
  // * @param
  // * @returns {number} 0 if DO NOT need spawn
  // * @returns {number} 1 if need spawn and successfully spawned
  // * @returns {number} 2 if need spawn but failed to spawn
  // */
  // const spawnByMinNumber_advance = (memory, bodyArray, minNumber, spawnSite = spawn, options = {}) => {

  //   options.memory = memory

  //   var currentRolers = _.filter(Game.creeps, (creep) => creep.memory.role == memory.role);
  //   // console.log(roleName + ':' + currentRolerArray.length);

  //   if (currentRolers.length < minNumber) {
  //     var newName = memory.role + Game.time;
  //     console.log(`Going to spawn new ${memory.role} ${currentRolers.length + 1}/${minNumber}: ${newName} at ${spawnSite} `);
  //     const spawnResult = spawnSite.spawnCreep(bodyArray, newName, options)
  //     if (spawnResult == 0) return 1
  //     else if (spawnResult == -6) return 2
  //   }
  //   else { return 0 }
  // }



  //*clean the dead(experiod)
  for (var name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log('Clearing non-existing creep memory:', name);
    }
  }



  //! /////////////SPAWN PART//////////////


  //spawn Harvester
  //if have 5 WORK PART+1MOVE:550
  // if (spawnByMinNumber(spawnName'harvester', [WORK, WORK, CARRY, MOVE], 1)) {
  //   return
  // }

  //! 临时
  spawnByMinNumber('W17N15_0', 'harvesterPlus2', evalBody_harvester('W17N15_0'), 2)

  spawnByMinNumber('W17N15_0', 'carrier2', body([CARRY, 4, MOVE, 2]), 2)
  spawnByMinNumber('W17N15_0', 'builder2', body([WORK, 4, CARRY, 4, MOVE, 4]), 2)

  spawnByMinNumber('W17N15_0', 'upgrader2', body([WORK, 10, CARRY, 1, MOVE, 5]), 2)
  // spawnByMinNumber('W17N15_0', 'builder2', body([WORK, 2, CARRY, 2, MOVE, 4]), 2)
  if (Game.getObjectById('5bbcb24140062e4259e93823').mineralAmount > 0) {

    spawnByMinNumber('W17N15_0', 'miner22', body([WORK, 5, CARRY, 5, MOVE, 5]), 1)
  }

  spawnByMinNumber('W17N15_0', 'base_transferor22', body([CARRY, 6, MOVE, 1]), 1,)






  //spawn HarvesterPlus

  memoryResources(spawn.room.name)


  if (spawnByMinNumber(spawnName, 'harvesterPlus', body([WORK, 7, CARRY, 1, MOVE, 4]), 2)) {
    return
  }
  // else return





  //spawn Repairer
  var repairTargets = spawn.room.find(FIND_STRUCTURES, {
    filter: (s) => {
      return (
        (s.structureType == STRUCTURE_CONTAINER
          && s.hits / s.hitsMax < 0.5)
        || (s.structureType == STRUCTURE_TOWER
          && s.hits / s.hitsMax < 1)
        || (s.structureType == STRUCTURE_RAMPART
          && s.hits < 1.2 * 1000 * 1000)
      )
    }
  });

  if (repairTargets.length) {
    spawnByMinNumber(spawnName, 'repairer', body([WORK, 6, CARRY, 6, MOVE, 6]), 1)
  }


  //* spawn Carrier
  spawnByMinNumber(spawnName, 'carrier', body([CARRY, 8, MOVE, 8]), 1)  //cost=650


  //* spawn Builder
  if (spawn.room.find(FIND_CONSTRUCTION_SITES).length) {
    spawnByMinNumber(spawnName, 'builder', body([WORK, 4, CARRY, 4, MOVE, 4]), 2)
  }

  //* spawn Upgrader
  spawnByMinNumber(spawnName, 'upgrader', body([WORK, 20, CARRY, 2, MOVE, 6]), 1)//COST: 2300


  //* spawn Sweepper
  // //let droppedResources = spawn.room.find(FIND_DROPPED_RESOURCES)

  // //if (droppedResources.length) {
  spawnByMinNumber(spawnName, 'sweepper', body([CARRY, 8, MOVE, 8]), 1)
  // //}




  //! LONG //////////////




  // //spawn long_carrier
  // spawnByMinNumber(spawnName, 'long_carrier', body([WORK, 1, CARRY, 10, MOVE, 6]), 2)

  // //spawn long_harvester
  // spawnByMinNumber(spawnName, 'long_harvester', body([WORK, 8, CARRY, 1, MOVE, 4]), 1)

  // //spawn long_pionner
  // // spawnByMinNumber(spawnName,'long_pionner', body([WORK, 5, CARRY, 5, MOVE, 5]), 0)

  // //spawn long_claimer
  // spawnByMinNumber(spawnName, 'long_reserver', body([CLAIM, 2, MOVE, 1]), 1)

  //! BASE //////////////////

  //spawn Base_transeror
  spawnByMinNumber(spawnName, 'base_transferor', body([CARRY, 6, MOVE, 1]), 1, {}
    , { directions: [RIGHT, BOTTOM_RIGHT] }
  )



  //! after LV6 /////

  //! HARD CODED
  if (Game.getObjectById('5bbcb26b40062e4259e939d2').mineralAmount > 0) {

    spawnByMinNumber(spawnName, 'miner', body([WORK, 8, CARRY, 8, MOVE, 8]), 1)
  }






}

module.exports = controller_spawns