const C = require("./util_consts")
const { spawnByMinNumber, body } = require("./util_helper")




/*

思路： 给旗子添加memory，
一个claimer，两个大worker




*/


/**
 * 前往指定旗子放下spawn
 * @param {Flag|String} flag 
 * @param {StructureSpawn|String} spawn
 * @param {String} targetRoom
 */
const claimNewRoom = (flag, spawn, targetRoom, opt = {}) => {

  //TODO 暂时没想到好办法，就加了个targetRoom。到时候想办法去掉这个参数


  if (typeof flag === "string") {
    flag = Game.flags[flag]
  }

  if (typeof spawn === "string") {
    spawn = Game.spawns[spawn]
  }

  if (!flag) {
    //找不到旗子或者旗子.room不是undefined(),或房间已被占领
    console.log('找不到旗子' + flag)
    return
  }

  let expend_claimer = 'expend_claimer_' + targetRoom
  let expend_builder = 'expend_builder_' + targetRoom

  let spawnName = targetRoom + '_0'


  if (Game.spawns[spawnName] == undefined) {
    spawnByMinNumber(spawn.name, expend_builder, body([WORK, 15, CARRY, 10, MOVE, 25]), 2,
      {
        workRoom: targetRoom
      })
  }


  if (_.isUndefined(flag.room) || (flag.room.controller && flag.room.controller.owner.username !== C.myName)) {

    spawnByMinNumber(spawn.name, expend_claimer, body([TOUGH, 4, MOVE, 4, CLAIM, 1, MOVE, 1]), 1,
      {
        workRoom: targetRoom
      })

  }



  if (flag.room) {
    flag.room.createConstructionSite(flag.pos.x, flag.pos.y - 3, STRUCTURE_SPAWN, spawnName)
    // console.log('flag.room.createConstructionSite(flag.pos.x + 3, flag.pos.y, STRUCTURE_SPAWN, `${flag.room.name}_0`): ', flag.room.createConstructionSite(flag.pos.x + 3, flag.pos.y, STRUCTURE_SPAWN, `${flag.room.name}_0`));
  }















}


module.exports = claimNewRoom