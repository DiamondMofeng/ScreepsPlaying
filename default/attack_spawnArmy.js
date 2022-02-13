

let spawn = Game.spawns['Spawn1']


/**
 * 输入简化版bodyArray来获取完全版
 * @param {Array} simpleBodyArray - ['part', i, ...] 应有偶数长度
 * @returns {Array} fullBodyArray
 */
const body = (simpleBodyArray) => {
  let result = []

  for (let i = 0; i < simpleBodyArray.length; i++) {
    let PART = simpleBodyArray[i].toString()
    let next = simpleBodyArray[i + 1]

    if (typeof next == 'undefined' || typeof next == 'string') {
      result.push(PART)
      continue
    }
    else {
      if (typeof next == 'number') {
        i++
        for (; next > 0; next--) {
          result.push(PART)
        }
      }

      else throw new Error('error input of body function')
    }
  }
  return result
}



