//import
const { targetsPriorizer_byRef } = require('./util_beheavor')
const C = require('./util_consts')


/**
 * 
 * @param {StructureTower} tower 
 * @returns 
 */
const roleTower = (tower) => {

  const TOWER_REPIRE_TARGET = 'towerRepaireTarget'

  //*有敌人时优先攻击敌人

  // [{ creep }, ...]
  let enemyTargets = tower.room.find(FIND_HOSTILE_CREEPS)

  if (enemyTargets.length) {

    //*先筛选具有攻击性的
    let enemiesHasAttack = _.filter(enemyTargets, t => (t.getActiveBodyparts(ATTACK) > 0) || (t.getActiveBodyparts(RANGED_ATTACK) > 0))

    if (enemiesHasAttack.length) {
      tower.attack(tower.pos.findClosestByRange(enemiesHasAttack))
      return
    }

    //否则攻击最近的
    else {
      tower.attack(tower.pos.findClosestByRange(enemyTargets))
      return
    }
  }


  //无敌人时：
  //若能量大于750则修建筑

  if (tower.store[RESOURCE_ENERGY] > 600) {

    if (!tower.room[TOWER_REPIRE_TARGET] && Game.time % C.TIME_INTERVAL_TOWER_REPIRE) {

      let targets = tower.room.find(FIND_STRUCTURES, {
        filter: (s) =>
          (s.structureType == STRUCTURE_RAMPART && s.hits < 10 * 1000)
          || (s.structureType == STRUCTURE_WALL && s.hits < 10 * 1000)
          || (s.structureType == STRUCTURE_ROAD && (s.hits / s.hitsMax) < 0.6)
          || (s.structureType == STRUCTURE_CONTAINER && (s.hits / s.hitsMax) < 0.3)

      });

      if (targets.length > 0) {
        targets.sort((a, b) => a.hits - b.hits);
        tower.room[TOWER_REPIRE_TARGET] = targets[0].id;
      }


    }
    if (tower.room[TOWER_REPIRE_TARGET]) {
      tower.repair(tower.room[TOWER_REPIRE_TARGET]);
    }


    // * ==============OLD==============
    // //修堡垒:
    // let rampartToRepair = tower.room.find(FIND_STRUCTURES,
    //   {
    //     filter: s => (s.structureType == STRUCTURE_RAMPART)
    //       && (s.hits < 10 * 1000)
    //   })
    // // console.log('rampartToRepair:', rampartToRepair)



    // if (rampartToRepair.length) {
    //   let towerRepairResult = tower.repair(rampartToRepair[0])
    //   // console.log('Tower repair result:', towerRepairResult)
    //   return
    // }


    // //修墙:
    // let wallToRepair = tower.room.find(FIND_STRUCTURES,
    //   {
    //     filter: s => (s.structureType == STRUCTURE_WALL)
    //       && (s.hits < 10 * 1000)
    //   })
    // // console.log('rampartToRepair:', rampartToRepair)



    // if (wallToRepair.length) {
    //   let towerRepairResult = tower.repair(wallToRepair[0])
    //   // console.log('Tower repair result:', towerRepairResult)
    //   return
    // }

    // //修路：
    // let roadToRepair = tower.room.find(FIND_STRUCTURES,
    //   {
    //     filter: s => (s.structureType == STRUCTURE_ROAD)
    //       && ((s.hits / s.hitsMax) < 0.6)
    //   })
    // // console.log('roadToRepair:', roadToRepair)


    // if (roadToRepair.length) {
    //   let towerRepairResult = tower.repair(roadToRepair[0])
    //   // console.log('Tower repair result:', towerRepairResult)
    //   return
    // }


    // let containerToRepair = tower.room.find(FIND_STRUCTURES,
    //   {
    //     filter: s => (s.structureType == STRUCTURE_CONTAINER)
    //       && ((s.hits / s.hitsMax) < 0.3)
    //   })
    // if (containerToRepair.length) {
    //   let towerRepairResult = tower.repair(containerToRepair[0])
    //   // console.log('Tower repair result:', towerRepairResult)
    //   return
    // }
  }



}
module.exports = roleTower