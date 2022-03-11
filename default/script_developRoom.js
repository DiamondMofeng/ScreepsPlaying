const C = require("./util_consts")
const { spawnByMinNumber, body } = require("./util_helper")




/*

思路:分RCL进行发展。

*================= RCL1:===============
造upgrader到2级




*================= RCL2:===============
按坐标放5个ext,
每个矿对应放一个container
生产harvesterPlus和builder和upgrader



*================= RCL3:===============
放5个ext(共10)
放tower
给每个source和controller铺路
*================= RCL4:===============
放10个ext(共20)

*================= RCL5:===============
放10个ext(共30)

*================= RCL6:===============
放10个ext(共40)

*================= RCL7:===============

放10个ext(共50)
*================= RCL8:===============

放10个ext(共60)



*/

const RCL1 = () => {

}

const RCL2 = () => {

}








/**
 * 前往指定旗子放下spawn
 * @param {Flag|String} flag 
 * @param {String} targetRoom
 */
const developNewRoom = (flag, targetRoom, opt = {}) => {

  //* 默认此时已建好spawn，根据flag的位置和rcl自动摆放建筑、生产creep

  if (!flag) {
    return
  }

  let spawnName = targetRoom + '_0'  //TODO 到时候用生产队列代替

  if (Game.spawns[spawnName] == undefined) {
    return
  }

  switch (Game.rooms[targetRoom].controller.level) {
    case 1:

      spawnByMinNumber(spawnName, 'upgrader_' + targetRoom, [WORK, MOVE, CARRY, MOVE], 3)

      break;
    case 2:
      spawnByMinNumber(spawnName, 'upgrader_' + targetRoom, [WORK, MOVE, CARRY, MOVE], 3)

      break;
    case 3:
      spawnByMinNumber(spawnName, 'upgrader_' + targetRoom, [WORK, MOVE, CARRY, MOVE], 3)

      break;
    case 4:
      break;
    case 5:
      break;
    case 6:
      break;
    case 7:
      break;
    case 8:
      break;
  }





}


module.exports = developNewRoom