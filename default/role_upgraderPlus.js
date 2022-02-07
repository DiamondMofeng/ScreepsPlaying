const { getEnergyFromContainer } = require('./util_beheavor')
const { memoryUpgradePosArray } = require('./util_getMemories')

//upgraderByPos

// memory:
// {
//   upgradePosIndex: number
//   atPos: boolen
// }

// room.memory:
// {
// upgradePos: [{ x: , y: , used: }]
// }



/**
 * 
 * @param {*} creep 
 * @returns {boolean} true - if getPos
 * @returns {boolean} false - if faild to get
 */
function getUpgradePos(creep) {
  let upgradePosArray = creep.room.memory.upgradePos
  for (i in upgradePosArray) {
    let pos = upgradePosArray[i]

    if (pos.used == false) {
      creep.memory.upgradePosIndex = i

      if (!creep.ticksToLive < 20) {
        pos.used = true
      }

      return true
    }
    else return false
  }
}

/**
 * 将升级工作位置向前优化，优化成功则atPos=false
 * @param {*} creep 
 * @returns {boolean} true - if succ
 * @returns {boolean} false - if do NOT need
 */

function optimizeUpgradePos(creep) {
  let upgradePosArray = creep.room.memory.upgradePos
  for (let i = 0; i < creep.memory.upgradePosIndex; i++) {
    if (upgradePosArray[i].used == false) {
      creep.memory.upgradePosIndex = i
      creep.memory.atPos = false
      return true
    }
    else return false
  }
}


/**
 * 移动至memory中升级工作位置。若已到达则更新atPos=true，反之false
 * @param {*} creep 
 * @returns {boolean} true - if at
 * @returns {boolean} false - if not at
 */
function moveToUpgradePos(creep) {
  let upgradePos = creep.room.memory.upgradePos[creep.memory.upgradePosIndex]
  if (creep.pos.x == upgradePos.x && creep.pos.y == upgradePos.y) {
    creep.memory.atPos = true
    return true
  }
  else {
    creep.memory.atPos = false
    console.log('upgradePos',upgradePos)
    let moveResult = creep.moveTo(upgradePos.x, upgradePos.y, { ignoreCreeps: false, visualizePathStyle: { stroke: '#FFFF00' } })
    // console.log('moveResult', moveResult)
    return false
  }
}

var roleUpgrader = {

  /** @param {Creep} creep **/
  run: function (creep) {

    if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.upgrading = false;
      creep.say('🔄 harvest');
    }
    if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
      creep.memory.upgrading = true;
      creep.say('⚡ upgrade');
    }

    //if have energy
    if (creep.memory.upgrading) {

      // memoryUpgradePosArray(creep.room)

      //检查是否有工作位置
      if (!creep.memory.upgradePos) {
        getUpgradePos(creep)
      }

      //检查优化工作区域
      optimizeUpgradePos(creep)

      //检查是否位于工作地点，并决定是否移动
      // console.log(`atPos:${creep.memory.atPos}`)
      if (creep.memory.atPos != true) {
        console.log(`atPos != true`)
        moveToUpgradePos(creep)
      }

      else {//位于工作地点,开始工作
        let result = creep.upgradeController(creep.room.controller)
        console.log("result:", result)
      }



      // let upgradePosArray = creep.room.memory.upgradePos
      // for (pos of upgradePosArray) {
      //   if (pos.used == false) {
      //     // if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
      //     creep.moveTo(pos.x, pos.y, { ignoreCreeps: true, visualizePathStyle: { stroke: '#FFFF00' } })
      //     // }

      //   }
      // }
      // if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
      //   creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#FFFF00' } });
      // }
    }
    //dont have energy
    else {
      if (getEnergyFromContainer(creep, 100, { ignoreCreeps: true })) {

      }
      else {//dig
        var sources = creep.room.find(FIND_SOURCES);

        if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
        }
      }
    }


  }
}
module.exports = roleUpgrader.run;