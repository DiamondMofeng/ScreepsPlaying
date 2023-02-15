import { TIME_INTERVAL } from '@/utils/consts'
import { useRoomCache } from '@/utils/hooks/useRoomCache'

export const runTower = (tower: StructureTower) => {

  const TOWER_REPIRE_TARGETS = 'towerRepaireTargets'
  const TOWER_ATTACK_TARGETS = 'towerAttackTargets'

  //*有敌人时优先攻击敌人

  const enemies = useRoomCache(tower.room, TOWER_ATTACK_TARGETS, () => tower.room.find(FIND_HOSTILE_CREEPS))

  if (enemies.length > 0) {
    let random = Math.floor(Math.random() * enemies.length)
    let target = enemies[random]
    tower.attack(target)

    // //*先筛选具有攻击性的
    // let enemiesHasAttack = _.filter(targets, t => (t.getActiveBodyparts(ATTACK) > 0) || (t.getActiveBodyparts(RANGED_ATTACK) > 0))

    // if (enemiesHasAttack.length) {
    //   tower.attack(tower.pos.findClosestByRange(enemiesHasAttack))
    //   return
    // }

    // //否则攻击最近的
    // else {
    //   tower.attack(tower.pos.findClosestByRange(targets))
    //   return
    // }

  }


  //无敌人时：
  //若能量大于750则修建筑

  if (tower.store[RESOURCE_ENERGY] > 600) {

    if (Game.time % TIME_INTERVAL.TOWER_REPIRE == 0) {

      const repairTargets = useRoomCache(tower.room, TOWER_REPIRE_TARGETS, () => tower.room.find(FIND_STRUCTURES, {
        filter: (s) =>
          (s.structureType == STRUCTURE_RAMPART && s.hits < 10 * 1000)
          || (s.structureType == STRUCTURE_WALL && s.hits < 10 * 1000)
          || (s.structureType == STRUCTURE_ROAD && (s.hits / s.hitsMax) < 0.6)
          || (s.structureType == STRUCTURE_CONTAINER && (s.hits / s.hitsMax) < 0.3)
      }));

      if (repairTargets.length > 0) {
        let random = Math.floor(Math.random() * repairTargets.length)
        tower.repair(repairTargets[random]);
      }


    }
  }


}
