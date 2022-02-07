const { memoryResources } = require('./util_getMemories')

const controller_spawns = () => {

  // const memoryResourves = (anyObjectHasMemory) => {
  //   const obj = anyObjectHasMemory
  //   //add memory
  //   if (!obj.room.memory.sources || obj.room.memory.sources.length == 0) {
  //     obj.room.memory.sources = []
  //     const sources = obj.room.find(FIND_SOURCES)

  //     // console.log(sources)
  //     const workPos = (s) => {
  //       // console.log('fine')
  //       if (s.id == '5bbcac3c9099fc012e635233') {
  //         // console.log('fine1')
  //         return new RoomPosition(9, 37, 'W12N16')
  //       }
  //       if (s.id == '5bbcac3c9099fc012e635232') {
  //         // console.log('fine2')
  //         return new RoomPosition(21, 31, 'W12N16')
  //       }
  //     }


  //     for (i in sources) {
  //       const s = sources[i]
  //       // console.log(workPos(s))
  //       // console.log('123',typeof s.id)

  //       obj.room.memory.sources[i] = {
  //         id: s.id,
  //         workPos: workPos(s),
  //         onHarvest: false,
  //         harvester: '',
  //       }
  //     }
  //   }
  // }


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
      return s.hits / s.hitsMax <= 0.6
    }
  });

  if (repairTargets.length) {
    spawnByMinNumber('repairer', [WORK, CARRY, MOVE], 3)
  }


  //spawn Carrier
  spawnByMinNumber('carrier', [WORK, CARRY, CARRY, CARRY, MOVE, MOVE], 6)  //cost=300


  //spawn Builder
  if (Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES).length) {
    spawnByMinNumber('builder', [WORK, WORK, CARRY, CARRY, MOVE, MOVE], 3)
  }

  //spawn Upgrader
  spawnByMinNumber('upgrader', [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE], 4)//COST: 750




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