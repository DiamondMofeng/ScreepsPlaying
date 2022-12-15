//? 用[...array].reverse以达到unmutable的效果

/**
   * 输入简化版bodyArray来获取完全版。part可以为字符串或数组
   * @param {Array} simpleBodyArray - [part: String|Array , i, ...] i为'part'的重复次数
   * @returns {Array} fullBodyArray
   * 
   * @example [WORK, 2, CARRY, 2, MOVE, 2] => [WORK, WORK, CARRY, CARRY, MOVE, MOVE]
   * @example [[WORK, CARRY, MOVE], 2] => [WORK, CARRY, MOVE, WORK, CARRY, MOVE]
   */
function body(...simpleBodyArray) {
  let result = []
  if (simpleBodyArray.length == 1) {
    simpleBodyArray = simpleBodyArray[0]
  }
  for (let i = 0; i < simpleBodyArray.length; i++) {

    let PART = simpleBodyArray[i]
    if (!(PART instanceof Array)) {
      if (typeof PART !== 'string') {
        throw new Error('error input of body function')
      }
    }

    let next = simpleBodyArray[i + 1]

    if (typeof next !== 'number') {
      result = result.concat(PART)
    }
    else {
      i++
      // for (; next > 0; next--) {
      //   result = result.concat(PART)
      // }
      let toPush = []
      if (!Array.prototype.flat) {
        toPush = _.flatten(new Array(Math.floor(next)).fill(PART))
      }
      else {
        toPush = new Array(Math.floor(next)).fill(PART).flat()
      }
      result = result.concat(toPush)


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
    cost += BODYPART_COST[part]
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
 * @returns {Object} {needSpawn: true, spawnResult: spawnResult}
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
  let creepsSpawnAtCurRoom = _.filter(Game.creeps, (creep) => creep.memory.spawnName === spawnName) //todo 待优化
  let currentRolerArray = _.filter(creepsSpawnAtCurRoom, (creep) => creep.memory.role == roleName);

  if (currentRolerArray.length < minNumber) {
    var newName = roleName + '_' + Game.time;
    console.log(`Going to spawn new ${roleName} ${currentRolerArray.length + 1}/${minNumber}: ${newName} at ${spawnName} , costing energy ${bodyCost(bodyArray)} `);
    let spawnResult = Game.spawns[spawnName].spawnCreep(bodyArray, newName, opt);
    // console.log('Game.spawns[spawnSite].spawnCreep(bodyArray, newName, opt): ', Game.spawns[spawnSite].spawnCreep(bodyArray, newName, opt));

    return { needSpawn: true, spawnResult: spawnResult }
  }
  else return { needSpawn: false, spawnResult: undefined }


}



/**
 * 打印此函数的cpu消耗
 * @param {Function} func
 * @returns 函数的原返回值
 */
function getCPUCost(func, ...args) {
  // console.log(func)
  let startCPU = Game.cpu.getUsed()
  let res = func(...args)
  let endCPU = Game.cpu.getUsed()

  let costTime = endCPU - startCPU
  console.log(`CPU cost of '${func.name}' :`, costTime);
  return res
}

/**
 * 
 * @param {String} tag 
 */
function cpuStart(tag) {
  global['tempCpuRecord_' + tag] = Game.cpu.getUsed()
}

/**
 * 
 * @param {String} tag 
 */
function cpuEnd(tag) {
  let start = global['tempCpuRecord_' + tag]
  let end = Game.cpu.getUsed()
  let costTime = end - start
  console.log(`CPU cost of tag '${tag}' :`, costTime);
}



/**
 * 检测head是否位于str的起始位置
 * @param {String} str 全字符串
 * @param {String} head 要检测的开头
 * @returns {boolean}
 */
function startWith(str, head) {

  if (!(typeof str == 'string') || !(typeof head == 'string')) return false

  if (str.length < head.length) return false

  for (let i = 0; i < head.length; i++) {
    if (str[i] === head[i]) { continue }
    else return false
  }
  return true
}



function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function cronRun(interval, func) {

  if (!_.isFunction(func)) {
    console.log('func is not a function')
  }
  if (!_.isNumber(interval)) {
    // console.log('interval is not a number')
    return;
  }

  if (Game.time % interval === 0) {
    return func()
  }


}


/**
 * 
 * @param {Function} func 
 * @returns 
 */
function errorIsolater(func) {

  try {
    return func()
  }
  catch (e) {
    console.log(e.stack)
  }

}


function getRemainingRenewTime(creep, targetTicksToLive = 1500) {

  /*
  增加目标 creep 的剩余生存时间。目标应在相邻的方格处。spawn 不应忙于孵化过程，且不能包含 CLAIM 身体部件。每次执行都会增加 creep 的计时器，根据此公式按 ticks 数计算：

  floor(600/body_size)

  每次执行所需的能量由以下公式确定:

  ceil(creep_cost/2.5/body_size)
  */

  // let renewTime = 0
  // let curLife = 1
  let curLife = creep.ticksToLive
  let bodySize = creep.body.length
  let creepCost = bodyCost(creep.body.map(part => part.type))

  let onceCost = Math.ceil(creepCost / 2.5 / bodySize)

  let onceTick = Math.floor(600 / bodySize) - 1

  let renewTimeCost = Math.ceil((targetTicksToLive - curLife) / onceTick)
  let renewEnergyCost = onceCost * renewTimeCost

  //计算是否节约能量
  //原始1tick的能量消耗
  let originEnergyCostPerTick = creepCost / targetTicksToLive
  //现在的能量消耗
  let nowEnergyCostPerTick = renewEnergyCost / (targetTicksToLive - curLife)
  console.log(originEnergyCostPerTick, nowEnergyCostPerTick)

  //重造至当前水平所需时间



  return {
    renewTimeCost,
    renewEnergyCost,
    originTimeCost: bodySize * 3,
    originEnergyCost: creepCost,

    // lostRatio: curLife / targetTicksToLive,

    // lostEnergyRatio: renewEnergyCost / creepCost,
    // lostTimeRatio: renewTimeCost / (bodySize * 3)



  }
}

/**
 * 
 * @param {Creep} creep 
 */
function getBodyArray(creep) {
  return creep.body.map(part => part.type)
}





module.exports = {
  body, bodyCost, spawnByMinNumber,
  getCPUCost, cpuStart, cpuEnd,
  startWith,

  randomInt,
  cronRun,
  errorIsolater,
  getRemainingRenewTime,
  getBodyArray,
}