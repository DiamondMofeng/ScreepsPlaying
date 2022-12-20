import { myName } from "@/utils/util_consts"
import { spawnByMinNumber, body } from "@/utils/util_helper"




/*

思路： 给旗子添加memory，
一个claimer，两个大worker




*/


/**
 * 前往指定旗子放下spawn
 * @param {Flag|String} flag 
 * @param {StructureSpawn|String} spawn
 * @param {Boolean} keepHelping 是否保持帮助
 */
const claimNewRoom = (flag, spawn, keepHelping = false) => {

  if (typeof flag === "string") {
    flag = Game.flags[flag]
  }

  if (typeof spawn === "string") {
    spawn = Game.spawns[spawn]
  }

  if (!flag) {
    //找不到旗子或者旗子.room不是undefined(),或房间已被占领
    console.log(`claimNewRoom ${flag} 找不到旗子 ${flag}`)
    return
  }

  if (!spawn) {
    console.log(`claimNewRoom ${flag} 找不到spawn ${spawn}`)
    return
  }

  let targetRoom = flag.pos.roomName

  let expend_claimer = 'expend_claimer';
  let expend_builder = 'expend_builder';

  let spawnName = targetRoom + '_0'

  //! TODO 换为使用spawnQueue。
  if (Game.spawns[spawnName] == undefined || keepHelping === true) {
    spawnByMinNumber(spawn.name, expend_builder, body([WORK, 15, CARRY, 10, MOVE, 25]), 3,
      {
        workRoom: targetRoom
      })
  }


  if (_.isUndefined(flag.room) || (flag.room.controller && flag.room.controller.owner.username !== myName)) {

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


export default claimNewRoom