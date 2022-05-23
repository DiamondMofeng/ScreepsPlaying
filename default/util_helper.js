//? 用[...array].reverse以达到unmutable的效果





//使用 _.groupBy选出ref最优先的target,若未满足匹配则返回原数组
function priorityFilter(targets, ref, priority, returnFirst = true) {
  let result = []
  let targetsGroupBy = _.groupBy(targets, ref)
  for (let i = 0; i < priority.length; i++) {
    let priorityName = priority[i]
    if (targetsGroupBy[priorityName]) {
      if (returnFirst) {
        return targetsGroupBy[priorityName][0]
      }
      result = result.concat(targetsGroupBy[priorityName])
    }
  }
  return result

}

//自动生成代码




/**
   * 输入简化版bodyArray来获取完全版。part可以为字符串或数组
   * @param {Array} simpleBodyArray - [part: String|Array , i, ...] i为'part'的重复次数
   * @returns {Array} fullBodyArray
   */
function body(...simpleBodyArray) {
  let result = []
  if (simpleBodyArray.length == 1) {
    simpleBodyArray = simpleBodyArray[0]
  }
  for (let i = 0; i < simpleBodyArray.length; i++) {

    let PART = simpleBodyArray[i]
    if (!PART instanceof Array) {
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
/**
 * 
 * @param {Array} targets 
 * @param {*} ref - 属性
 * @param {Array} priority 
 * @returns {} - 
 */
function priorByRef(targets, ref, priority) {
  _targets = _.groupBy()
}







module.exports = {
  body, bodyCost, spawnByMinNumber,
  getCPUCost,
  startWith
}