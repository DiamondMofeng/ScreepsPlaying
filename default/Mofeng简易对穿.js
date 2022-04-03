const offsetsByDirection = [, [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];

const CM_LAST_MOVE = '_lastMove'
const CM_LAST_POS = '_lastPos'

const deserializePath = function (path) {
  if (!_.isString(path)) {
    throw new Error('`path` is not a string');
  }

  var result = [];
  if (!path.length) {
    return result;
  }
  var x, y, direction, dx, dy;

  x = parseInt(path.substring(0, 2));
  y = parseInt(path.substring(2, 4));
  if (_.isNaN(x) || _.isNaN(y)) {
    throw new Error('`path` is not a valid serialized path string');
  }

  for (var i = 4; i < path.length; i++) {
    direction = parseInt(path.charAt(i));
    if (!offsetsByDirection[direction]) {
      throw new Error('`path` is not a valid serialized path string');
    }
    dx = offsetsByDirection[direction][0];
    dy = offsetsByDirection[direction][1];
    if (i > 4) {
      x += dx;
      y += dy;
    }
    result.push({
      x, y,
      dx, dy,
      direction
    });
  }
}

/**
 * 高消耗的对穿，为每个move增加>0.03 CPU成本
 * @param {Creep} creep 
 * @param {RoomPosition} targetPos 
 * @returns 
 */
const lookAndDuichuan = (creep, targetPos) => {
  let lookCreeps = targetPos.lookFor(LOOK_CREEPS)
  // console.log('lookCreeps: ', lookCreeps);
  if (lookCreeps.length > 0) {
    let otherCreep = lookCreeps[0]
    console.log('对穿from', creep, 'to', otherCreep)

    //如果没有_lastPos则对穿
    //如果对方creep上tick未进行move，则认定为站住的creep，进行对穿
    if (_.isUndefined(otherCreep.memory[CM_LAST_MOVE])
      || otherCreep.memory[CM_LAST_MOVE] < Game.time - 1) {

      console.log('对穿2from', creep, 'to', otherCreep)

      // otherCreep.cancelOrder('move')
      otherCreep.say('✌', true)

      otherCreep.move(otherCreep.pos.getDirectionTo(creep.pos))
    }
  }

}


const mountDuichuan = () => {

  Creep.prototype._move = Creep.prototype.move

  Creep.prototype.move = function (...args) {
    let moveRes = this._move(args)
    if (moveRes == OK) {
      this.memory[CM_LAST_MOVE] = Game.time
    }
    return moveRes
  }

  Creep.prototype._moveByPath = Creep.prototype.moveByPath;

  Creep.prototype.moveByPath = function (path) {

    this.memory[CM_LAST_MOVE] = Game.time

    //数组储存的path
    if (_.isArray(path) && path.length > 0 && (path[0] instanceof RoomPosition)) {
      var idx = _.findIndex(path, (i) => i.isEqualTo(this.pos));
      if (idx === -1) {
        if (!path[0].isNearTo(this.pos)) {
          return ERR_NOT_FOUND;
        }
      }
      idx++;
      if (idx >= path.length) {
        return ERR_NOT_FOUND;
      }

      lookAndDuichuan(this, path[idx]) //* 加入对穿

      return this.move(this.pos.getDirectionTo(path[idx]));
    }

    //字符串储存的path
    if (_.isString(path)) {
      path = deserializePath(path);
    }
    if (!_.isArray(path)) {
      return ERR_INVALID_ARGS;
    }
    var cur = _.find(path, (i) => i.x - i.dx == this.pos.x && i.y - i.dy == this.pos.y);
    if (!cur) {
      return ERR_NOT_FOUND;
    }


    lookAndDuichuan(this, new RoomPosition(cur.x, cur.y, this.room.name)) //* 加入对穿

    return this.move(cur.direction);
  }

}



module.exports = mountDuichuan