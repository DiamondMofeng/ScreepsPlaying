
/**
 * sort by alphabetical order
 */
const whiteList = new Set([

  // 'Invader', //for test

  '6g3y',
  //A
  'Appassionata',
  //C
  'Christinayo',
  //D

  //E
  'ExtraDim',
  //F
  'fangxm',
  'FoFo',
  //G
  'GlennGould',
  //H
  'Hyst',
  //K
  'keqing',
  //L
  'laj18',
  //M
  'mcnianyu',
  'Monero',
  //R
  'RayAidas',
  //S
  'somygame',
  'superbitch',
  'Sokranotes',


]);


const mountWhiteList = function () {


  Room.prototype._find = Room.prototype.find

  Room.prototype.find = function (...args) {
    let res = this._find(...args);
    switch (args[0]) {
      case FIND_HOSTILE_CREEPS:
      case FIND_HOSTILE_POWER_CREEPS:
      case FIND_HOSTILE_SPAWNS:
      case FIND_HOSTILE_STRUCTURES:
      case FIND_HOSTILE_CONSTRUCTION_SITES:
        res = res.filter(objWithOwner => whiteList.has(objWithOwner.owner.username) == false);
        break;
    }
    return res;
  };

  // RoomPosition.prototype.look

}


module.exports = mountWhiteList;