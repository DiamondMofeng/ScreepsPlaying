//import
const { targetsPriorizer_byRef } = require('./util_beheavor')


const roleTower = (tower) => {


  //有敌人时优先攻击敌人

  // [{ creep }, ...]
  let enemyTargets = tower.room.find(FIND_HOSTILE_CREEPS)

  if (enemyTargets.length) {

    //先筛选具有攻击性的
    let enemiesHasAttack = _.filter(enemyTargets, t => (t.body.indexOf(ATTACK) != -1) || (t.body.indexOf(RANGED_ATTACK) != -1))

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

  if (tower.store[RESOURCE_ENERGY] > 750) {
    {

      //修堡垒:
      let rampartToRepair = tower.room.find(FIND_STRUCTURES,
        {
          filter: s => (s.structureType == STRUCTURE_RAMPART)
            && ((s.hits / s.hitsMax) < 0.5)
        })
      // console.log('rampartToRepair:', rampartToRepair)



      if (rampartToRepair.length) {
        let towerRepairResult = tower.repair(rampartToRepair[0])
        // console.log('Tower repair result:', towerRepairResult)
      }
    }



    //修路：
    let roadToRepair = tower.room.find(FIND_STRUCTURES,
      {
        filter: s => (s.structureType == STRUCTURE_ROAD)
          && ((s.hits / s.hitsMax) < 0.75)
      })
    // console.log('roadToRepair:', roadToRepair)



    if (roadToRepair.length) {
      let towerRepairResult = tower.repair(roadToRepair[0])
      // console.log('Tower repair result:', towerRepairResult)
    }
  }



}
module.exports = roleTower