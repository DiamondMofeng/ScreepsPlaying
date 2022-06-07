const offsetsByDirection = [, [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];

const CM_LAST_MOVE = '_lastMove'
const CM_LAST_POS = '_lastPos'

/**
 * 简单比较两个位置是否相同
 * @param {Object|RoomPosition} pos1 
 * @param {Objcet|RoomPosition} pos2 
 * @returns 
 */
const isSamePos = (pos1, pos2) => {
  if (_.isUndefined(pos1.x)
    || _.isUndefined(pos1.y)
    || _.isUndefined(pos2.x)
    || _.isUndefined(pos2.y)) {
    return false
  }

  if (pos1.x == pos2.x && pos2.x == pos2.y) {
    return true
  }
  else return false

}

/**
 * 获取curPos在dir方向的坐标
 * @param {RoomPosition} curPos 
 * @param {Number} dir 
 * @returns 
 */
const getPostionByDirection = (curPos, dir) => {
  let dx = offsetsByDirection[dir][0];
  let dy = offsetsByDirection[dir][1];
  return new RoomPosition(curPos.x + dx, curPos.y + dy, curPos.roomName)
}

/**
 * 高消耗的对穿，为每个move增加>0.03 CPU成本
 * TODO 跨房时会导致MOVE出现BUG，暂未修复
 * @param {Creep} creep 
 * @param {RoomPosition} targetPos 
 * @returns 
 */
const lookAndDuichuan = (creep, targetPos) => {
  let lookCreeps = []
  lookCreeps = lookCreeps.concat(targetPos.lookFor(LOOK_CREEPS))
  lookCreeps = lookCreeps.concat(targetPos.lookFor(LOOK_POWER_CREEPS))
  // console.log('lookCreeps: ', creep, lookCreeps);
  if (lookCreeps.length > 0) {
    let otherCreep = lookCreeps[0]
    //如果没有_lastPos则对穿
    //如果对方creep上tick未进行move，则认定为站住的creep，进行对穿
    if (_.isUndefined(otherCreep.memory[CM_LAST_MOVE])
      || otherCreep.memory[CM_LAST_MOVE] < Game.time - 1) {

      console.log('对穿from', creep, 'to', otherCreep)

      // otherCreep.cancelOrder('move')
      otherCreep.say('✌', true)

      otherCreep.move(otherCreep.pos.getDirectionTo(creep.pos), false)
      // console.log('otherCreep.move(otherCreep.pos.getDirectionTo(creep.pos)): ', otherCreep.move(otherCreep.pos.getDirectionTo(creep.pos)));
    }
  }

}



/**
 * 挂载极简对穿
 */
const mountSimpleDuichuan = () => {


  Creep.prototype._move = Creep.prototype.move

  PowerCreep.prototype._move = Creep.prototype.move

  Creep.prototype.move = function (dir, isDuichuan = true) {
    let moveRes = this._move(dir)
    if (moveRes == OK) {
      this.memory[CM_LAST_MOVE] = Game.time

      if (isDuichuan) {
        lookAndDuichuan(this, getPostionByDirection(this.pos, dir))
      }

    }

    return moveRes
  }

  // PowerCreep.prototype.move = function (dir, isDuichuan = true) {
  //   let moveRes = this._move(dir)
  //   if (moveRes == OK) {
  //     this.memory[CM_LAST_MOVE] = Game.time

  //     if (isDuichuan) {
  //       lookAndDuichuan(this, getPostionByDirection(this.pos, dir))
  //     }

  //   }

  //   return moveRes
  // }

}



module.exports = mountSimpleDuichuan