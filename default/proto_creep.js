



const proto_creep = () => {



  Object.defineProperty(Creep.prototype, 'isMoving', {
    // get() { },
    // set() { },
    configurable: true
  })










  /**
     * 偷的官方的MoveByPath,用于配套goto
     * @param {Array|String} path 
     * @returns 
     */
  Creep.prototype._moveByPath = function (path, opt = {}) {
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

      //* 修改部分/////////////////
      if (opt.duichuan == true) {
        if (this.memory.lastMove.pos &&
          this.pos.x === this.memory.lastMove.pos.x && this.pos.y === this.memory.lastMove.pos.y) {
          // let direction = this.pos.getDirectionTo(path[idx])
          let posToLook = new RoomPosition(path[idx].x, path[idx].y, this.room.name)
          let c = posToLook.lookFor(LOOK_CREEPS)
          if (c.length > 0) {
            this.duichuan(c[0])
          }
        }
      }

      //* 修改结束//////////////////

      return this.move(this.pos.getDirectionTo(path[idx]));
    }

    if (_.isString(path)) {
      path = utils.deserializePath(path);
    }
    if (!_.isArray(path)) {
      return ERR_INVALID_ARGS;
    }
    var cur = _.find(path, (i) => i.x - i.dx == this.pos.x && i.y - i.dy == this.pos.y);
    if (!cur) {
      return ERR_NOT_FOUND;
    }

    return this.move(cur.direction);
  }







  /**
   * 
   * @param {RoomPosition} dest - 目的地
   */
  Creep.prototype.goto = function (dest, opt = {}) {

    //适用于对穿的寻路。    //! 只是调用了对穿方法，对穿方法应在下面定义。
    /*
    调用路线：
    creep.pos.findPathTo  =>  creep.moveByPath
                                    \|/
                                若堵住则对穿
    基本沿用moveTo,但是无视creep
    每次移动时记录memory:goto:
    {
      lastMove:{
        tick:上次goto的tick ,
        pos:上次所在pos ,
      }
    }
    移动前检查lastMove.pos，如果相同，则认为被堵住，尝试对穿
  
  
  
    */









    //* MAIN  /////////////




    //* 初始化lastMove
    if (_.isUndefined(this.memory.lastMove)) {
      this.memory.lastMove = {};
    }


    //* 寻路
    if (_.isUndefined(this.memory._MOVE)) {
      this.memory._MOVE = this.pos.findPathTo(dest, { ignoreCreeps: true });
    }
    //* moveByPath
    if (this.memory.lastMove
      && this.memory.lastMove.dest
      && dest.pos instanceof RoomPosition ? dest : dest.pos != new RoomPosition(this.memory.lastMove.dest)) {
      delete this.memory._move;
    }
    let moveResult = this._moveByPath(this.memory._MOVE, { duichuan: true })



    //* 检查是否被堵住
    //在_moveByPath里



    //* 更新lastMove
    this.memory.lastMove.tick = Game.time;
    this.memory.lastMove.pos = this.pos;
    this.memory.lastMove.dest = dest.pos instanceof RoomPosition ? dest : dest.pos


    return moveResult;
  }


  /**
   * 让对方creep朝本creep进行一次Move
   * !注意！现在被穿的creep不会自己回来。只会被他任务引导重新寻路。
   * @param {Creep} target - 发起对穿的目标creep
   * @param {Object} opt 
   */
  Creep.prototype.duichuan = function (target, opt = {}) {

    let moveResult = target.move(target.pos.getDirectionTo(this.pos))
    return moveResult;
  }
}

module.exports = proto_creep;