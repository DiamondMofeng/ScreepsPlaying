const { memoryResources } = require('./util_getMemories')

const controller_spawns = () => {

  let spawn =Game.spawns['Spawn1']



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

  /*
  return TRUE if need spawn
  */
  const spawnByMinNumber = (roleName, bodyArray, minNumber, spawnSite = 'Spawn1', options = {}) => {

    var currentRolerArray = _.filter(Game.creeps, (creep) => creep.memory.role == roleName);
    // console.log(roleName + ':' + currentRolerArray.length);

    if (currentRolerArray.length < minNumber) {
      var newName = roleName + Game.time;
      console.log(`Going to spawn new ${roleName} ${currentRolerArray.length + 1}/${minNumber}: ${newName} at ${spawnSite} `);
      Game.spawns[spawnSite].spawnCreep(bodyArray, newName,
        { memory: { role: roleName } });
      return true
    }
    else { return false }
  }

  const spawnByMinNumber_advance = (memory, bodyArray, minNumber, spawnSite = 'Spawn1', options = {}) => {
    /**
     * @param
     * @returns {number} 0 if DO NOT need spawn
     * @returns {number} 1 if need spawn and successfully spawned
     * @returns {number} 2 if need spawn but failed to spawn
     */
    options.memory = memory

    var currentRolerArray = _.filter(Game.creeps, (creep) => creep.memory.role == memory.role);
    // console.log(roleName + ':' + currentRolerArray.length);

    if (currentRolerArray.length < minNumber) {
      var newName = memory.role + Game.time;
      console.log(`Going to spawn new ${memory.role} ${currentRolerArray.length + 1}/${minNumber}: ${newName} at ${spawnSite} `);
      const spawnResult = Game.spawns[spawnSite].spawnCreep(bodyArray, newName, options)
      if (spawnResult == 0) return 1
      else if (spawnResult == -6) return 2
    }
    else { return 0 }
  }



  //clean the dead(experiod)
  for (var name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log('Clearing non-existing creep memory:', name);
    }
  }



  ///////////////SPAWN PART//////////////


  //spawn Harvester
  //if have 5 WORK PART+1MOVE:550
  // if (spawnByMinNumber('harvester', [WORK, WORK, CARRY, MOVE], 1)) {
  //   return
  // }




  //spawn HarvesterPlus

  memoryResources(Game.spawns['Spawn1'].room)
  ///////////////WARNING!!! HARD CODED////////////////
  const spareSources = _.filter(Game.spawns['Spawn1'].room.memory.sources, s => s.onHarvest == false)
  if (spareSources.length) {
    let resource = spareSources[0]
    let harP_result = spawnByMinNumber_advance(
      {
        role: 'harvesterPlus',
        workPos: resource.workPos,
        sourceId: resource.id,
      },
      [WORK, WORK, WORK, WORK, WORK, MOVE], 2)
    if (harP_result === 2) {
      return
      //then set the memory of SOURCE
    }
    else if (harP_result === 1) {
      Game.spawns['Spawn1'].room.memory.sources[resource.id].onHarvest = true
      return
    }
    // else return
  }




  //spawn Repairer
  var repairTargets = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
    filter: (s) => {
      return (
        (s.structureType == STRUCTURE_CONTAINER
          // || s.structureType == STRUCTURE_ROAD
          || s.structureType == STRUCTURE_RAMPART
          || s.structureType == STRUCTURE_TOWER)
        && ((s.hits / s.hitsMax) < 1))
    }
  });

  if (repairTargets.length) {
    spawnByMinNumber('repairer', [WORK, CARRY, MOVE], 2)
  }


  //spawn Carrier
  spawnByMinNumber('carrier', body([WORK, CARRY, 6, MOVE, 5]), 6)  //cost=650


  //spawn Builder
  if (Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES).length) {
    spawnByMinNumber('builder', [WORK, WORK, CARRY, CARRY, MOVE, MOVE], 1)
  }

  //spawn Upgrader
  spawnByMinNumber('upgrader', body([WORK, 5, CARRY, MOVE, 4]), 4)//COST: 750


  //spawn Sweepper
  // let droppedResources = spawn.room.find(FIND_DROPPED_RESOURCES)

  // if (droppedResources.length) {
  //   spawnByMinNumber('sweepper', body([WORK, CARRY, 10, MOVE, 11]), 1)
  // }





  //show what is spawning
  if (Game.spawns['Spawn1'].spawning) {
    var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
    Game.spawns['Spawn1'].room.visual.text(
      '🛠️' + spawningCreep.memory.role,
      Game.spawns['Spawn1'].pos.x + 1,
      Game.spawns['Spawn1'].pos.y,
      { align: 'left', opacity: 0.8 });
  }


}

module.exports = controller_spawns