//? 用[...array].reverse以达到unmutable的效果



/**
   * 输入简化版bodyArray来获取完全版。part可以为字符串或数组
   * @param {Array} simpleBodyArray - [part: String|Array , i, ...] i为'part'的重复次数
   * @returns {Array} fullBodyArray
   */
function body(simpleBodyArray) {
  let result = []

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
      for (; next > 0; next--) {
        result = result.concat(PART)
      }
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
 * @returns TRUE if need spawn 
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
  // console.log('opt: ', JSON.stringify(opt));

  var currentRolerArray = _.filter(Game.creeps, (creep) => creep.memory.role == roleName);
  // console.log(roleName + ':' + currentRolerArray.length);

  if (currentRolerArray.length < minNumber) {
    var newName = roleName + Game.time;
    console.log(`Going to spawn new ${roleName} ${currentRolerArray.length + 1}/${minNumber}: ${newName} at ${spawnName} , costing energy ${bodyCost(bodyArray)} `);
    Game.spawns[spawnName].spawnCreep(bodyArray, newName, opt);
    // console.log('Game.spawns[spawnSite].spawnCreep(bodyArray, newName, opt): ', Game.spawns[spawnSite].spawnCreep(bodyArray, newName, opt));
    return true
  }
  else { return false }
}

function getCPUCost(func) {
  let startTime = Game.cpu.getUsed()
  func
  let endTime = Game.cpu.getUsed()

  let costTime = endTime - costTime
  return costTime
}

module.exports = { body, bodyCost, spawnByMinNumber }