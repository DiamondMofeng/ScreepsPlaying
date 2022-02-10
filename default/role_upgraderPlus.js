// const { getEnergyFromContainer } = require('./util_beheavor')
const { memoryUpgradePosArray } = require('./util_getMemories')

//upgraderByPos

// memory:
// {
//   upgradePosIndex: number
//   atPos: boolen
// }

// room.memory:
// {
// upgradePos: [{ x: , y: , used: }, ... ]
// }


//define PART
const getEnergyFromUpgradeContainer = function (creep) {
  let UPcontainer = creep.pos.findInRange(FIND_STRUCTURES, 2, { filter: s => s.structureType == STRUCTURE_CONTAINER })[0]
  // console.log('upcontainer',UPcontainer)
  if (UPcontainer) {
    let upgraderWithdrawResult = creep.withdraw(UPcontainer, RESOURCE_ENERGY)
    // console.log("upgraderWithdrawResult", upgraderWithdrawResult)
    if (upgraderWithdrawResult === 0) {
      return true
    }
    else {
      // console.log("upgrader failed to withdraw energy from container", upgraderWithdrawResult)
      return false
    }
  }
}



/**
 * 赋予creep.memory.upgradePosIndex </br>
 * 并使creep.room.memory.upgradePos[i].used = true
 * @param {*} creep 
 * @returns {boolean} true - if getPos
 * @returns {boolean} false - if faild to get
 */
function getUpgradePos(creep) {
  if (creep.memory.upgradePosIndex) {
    return
  }
  console.log('getUpPosIndex:', creep)


  let upgradePosArray = creep.room.memory.upgradePos

  // console.log('creep.room.memory', creep.room.memory)
  // console.log('upgradePosArray', upgradePosArray)
  for (i in upgradePosArray) {
    // console.log('i:', i)
    let pos = upgradePosArray[i]
    if (pos.used == false) {
      console.log(`${creep} .memory.upgradeIndex is set to ${i}`)

      creep.memory.upgradePosIndex = i
      pos.used = true

      return true
    }
  }
  return false
}

/**
 * 将升级工作位置向前优化，成功则对memory进行更新：
 
 * 
 * @param {*} creep 
 * 
 * @result creep.room.memory.upgradePos[creep.memory.upgradePosIndex].used = false
 * @result creep.room.memory.upgradePos[i].used = true
 * 
 * @result creep.memory.upgradePosIndex = newIndex
 * @result creep.memory.atPos = false
 * 
 * 
 * @returns {boolean} true - if succ
 * @returns {boolean} false - if do NOT need
 */

function optimizeUpgradePos(creep) {
  let upgradePosArray = creep.room.memory.upgradePos

  for (let i = 0; i < creep.memory.upgradePosIndex; i++) {
    if (upgradePosArray[i].used == false) {

      console.log(creep, ' changes his upgradePosIndex to ', i)

      creep.memory.upgradePosIndex = i
      creep.memory.atPos = false

      creep.room.memory.upgradePos[creep.memory.upgradePosIndex].used = false
      // creep.room.memory.upgradePos[i].used = true


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
  //if 已到达
  if (creep.pos.x === upgradePos.x && creep.pos.y === upgradePos.y) {
    creep.memory.atPos = true
    return true

  } else {
    console.log(creep, "is moving to pos", creep.memory.upgradePosIndex)

    creep.memory.atPos = false
    console.log('upgradePos', JSON.stringify(upgradePos))
    let moveResult = creep.moveTo(upgradePos.x, upgradePos.y, { ignoreCreeps: false, visualizePathStyle: { stroke: '#FFFF00' } })
    // console.log('moveResult', moveResult)
    return false
  }
}









//! ////main/////
var roleUpgrader = {

  /** @param {Creep} creep **/
  run: function (creep) {

    //IF 将要老死
    if (creep.ticksToLive < 3) {
      //放回所有energy
      creep.transfer(
        creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_CONTAINER })
        , RESOURCE_ENERGY)

      //更改memory:
      creep.room.memory.upgradePos[creep.memory.upgradePosIndex].used = false

      creep.memory.atPos = false
      creep.memory.upgradePosIndex = -1

      return
    }


    else {

      // memoryUpgradePosArray(creep.room)

      //若无工作位置则进行赋予
      getUpgradePos(creep)

      //优化工作位置 
      optimizeUpgradePos(creep)

      //检查是否位于工作地点，并决定是否移动
      // console.log(`atPos:${creep.memory.atPos}`)


      // if (creep.memory.atPos != true) {
      // console.log(`atPos != true`)
      moveToUpgradePos(creep)
      // }

      //位于工作地点,开始工作
      //若无能量就去获取能量
      if (creep.store[RESOURCE_ENERGY] == 0) {
        // creep.say('🧲 energy')

        getEnergyFromUpgradeContainer(creep)
      }

      else {
        // creep.say('⚡ upgrade');

        let upgradeResult = creep.upgradeController(creep.room.controller)
        // console.log("upgradeResult:", upgradeResult)
      }
    }
    //dont have energy



  }
}

module.exports = roleUpgrader.run;