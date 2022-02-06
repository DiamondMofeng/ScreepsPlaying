const controller_spawns = () => {

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
  if (spawnByMinNumber('harvester', [WORK, WORK, CARRY, MOVE], 3)) {
    return
  }

  //spawn Repairer
  var repairTargets = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
    filter: (s) => {
      return s.hits / s.hitsMax <= 0.6
    }
  });

  if (repairTargets.length) {
    spawnByMinNumber('repairer', [WORK, CARRY, MOVE], 1)
  }



  //spawn Builder
  if (Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES).length) {
    spawnByMinNumber('builder', [WORK, WORK, CARRY,CARRY, MOVE,MOVE], 1)
  }

  //spawn Upgrader
  spawnByMinNumber('upgrader', [WORK, WORK, CARRY,CARRY, MOVE, MOVE], 7)//COST: 350 




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