import { moveAndBoost, isPartAllBoosted, healLower, moveToRoom, getOppoDir } from "@/utils/util_beheavor";
import { body } from "@/utils/util_helper";






/**
 * 放风筝，保持距离为range
 * @param {Creep} creep 
 * @param {Array} targets 
 * @param {Number} range - 保持风筝的距离
 * @param {KiteOpts} opt - 用于寻路的设置
 */
function kite(creep, targets, range = 3, opt = {}) {
  //初始化opt
  opt.range = opt.range || range
  // opt.ignoreCreeps = opt.ignoreCreeps || IGNORE_CREEPS
  opt.flee = opt.flee || true
  // opt.costMatrix = opt.costMatrix || avoidTouch(getObjectsByPrototype(Creep).filter(c => !c.my))

  let chase = opt.chase || false


  let distance = creep.pos.getRangeTo(targets[0])

  //* 若距离相同则等待/追击
  if (distance == range) {
    if (chase) {
      return creep.moveTo(targets, opt)
    }
    else {
      return
    }
  }

  //若距离过小则flee
  if (distance < range) {
    let fleePath = creep.room.findPath(creep, targets, opt)
    console.log('fleePath: ', fleePath);
    if (fleePath.length > 0) {
      creep.moveTo(fleePath[0])
    }
    else {//解决默认flee被贴脸后卡住的情况
      let curDir = creep.pos.getDirectionTo(targets[0])
      // console.log('curDir: ', curDir);
      let oppoDir = getOppoDir(curDir)
      // console.log('oppoDir: ', oppoDir);
      creep.move(oppoDir)
    }
  }

  //若距离过大则靠近
  else {
    creep.moveTo(targets)
    console.log(1)
  }
}















const attack_yitiji = function (fromRoomName, toFlagName) {

  const yitiji_var = 'yitiji';

  let spawnRoom = Game.rooms[fromRoomName];
  if (!spawnRoom || !spawnRoom.controller || !spawnRoom.controller.my) {
    console.log('attack_yitiji: spawnRoom not found:', fromRoomName, ' is not my room');
    return;
  }

  let flag = Game.flags[toFlagName];
  if (!flag) {
    console.log('DISMENTAL flag not found:', toFlagName);
    return;
  }
  let FM = flag.memory;

  let name_yitiji = 'single_' + fromRoomName + '_' + toFlagName;

  if (!FM[yitiji_var]) {
    FM[yitiji_var] = name_yitiji;
    spawnRoom.pushToSpawnQueue({
      body: body([TOUGH, 12, RANGED_ATTACK, 5, MOVE, 9, HEAL, 23, MOVE, 1]), //[ TOUGH * 12, RANGED_ATTACK * 5, MOVE * 10, HEAL * 23 ]
      role: "yitiji",
      name: name_yitiji,
    })
  }



  if (!Game.creeps[name_yitiji]) {
    return;
  }

  let yitiji = Game.creeps[name_yitiji];

  if (!yitiji) {
    delete FM[yitiji_var];
    return;
  }


  //boost 
  //TODO 
  if (!FM.boosted1) {
    if (!isPartAllBoosted(yitiji, RANGED_ATTACK)) {
      // console.log('notAllBoosted')
      let lab_WORK = yitiji.room.find(FIND_MY_STRUCTURES, { filter: s => s.structureType === STRUCTURE_LAB && s.store && s.store['XKHO2'] >= 5 * 30 })[0];
      // console.log('lab_WORK: ', lab_WORK);
      moveAndBoost(yitiji, lab_WORK);

    }

    else {
      FM.boosted1 = true;
    }

    return
  }

  if (!FM.boosted2) {
    if (!isPartAllBoosted(yitiji, TOUGH)) {

      let lab_TOUGH = yitiji.room.find(FIND_MY_STRUCTURES, { filter: s => s.structureType === STRUCTURE_LAB && s.store && s.store['XGHO2'] >= 12 * 30 })[0];
      console.log('lab_TOUGH: ', lab_TOUGH);
      moveAndBoost(yitiji, lab_TOUGH);

    } else {
      FM.boosted2 = true;
    }
    return
  }

  if (!FM.boosted3) {
    if (!isPartAllBoosted(yitiji, MOVE)) {
      let lab_MOVE = yitiji.room.find(FIND_MY_STRUCTURES, { filter: s => s.structureType === STRUCTURE_LAB && s.store['XZHO2'] >= 10 * 30 })[0];
      console.log('lab_MOVE: ', lab_MOVE);
      moveAndBoost(yitiji, lab_MOVE);
    }
    else {
      FM.boosted3 = true;
    }
    return
  }
  //XLHO2
  if (!FM.boosted4) {
    if (!isPartAllBoosted(yitiji, HEAL)) {
      let lab_HEAL = yitiji.room.find(FIND_MY_STRUCTURES, { filter: s => s.structureType === STRUCTURE_LAB && s.store['XLHO2'] >= 23 * 30 })[0];
      console.log('lab_MOVE: ', lab_HEAL);
      moveAndBoost(yitiji, lab_HEAL);
    }
    else {
      FM.boosted4 = true;
    }
    return
  }



  //! 准备工作完成，出发！

  //前往地点
  moveToRoom(yitiji, flag.pos.roomName, true);

  //攻击
  // if (flag.pos.getRangeTo(yitiji) <= 1) {
  //   let target = flag.pos.lookFor(LOOK_STRUCTURES)[0];

  //   let desRes = yitiji.dismantle(target);
  //   console.log('desRes: ', desRes);

  // }
  yitiji.moveTo(flag)

  //到达房间后 自由攻击
  yitiji.heal(yitiji);
  yitiji.rangedMassAttack();

  // yitiji.rangedAttack(Game.getObjectById('629f792332257f4efc429ea7'))
  return

  // let enemys = yitiji.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
  // if (enemys.length > 0) {
  //   //sort by distance
  //   enemys.sort((b, a) => a.pos.getRangeTo(yitiji) - b.pos.getRangeTo(yitiji));
  //   // kite(yitiji, enemys);
  //   yitiji.rangedAttack(enemys[0]);

  //   return;
  // }

  //若没有敌人 则乱拆。
  let spawns = yitiji.room.find(FIND_HOSTILE_SPAWNS)
  if (spawns.length > 0) {
    yitiji.moveTo(spawns[0]);
    yitiji.rangedAttack(spawns[0]);
    return;
  }

  //TODO 可能会卡寻路
  let structures = yitiji.room.find(FIND_HOSTILE_STRUCTURES);
  if (structures.length > 0) {
    yitiji.moveTo(structures[0]);

  }




}

export default attack_yitiji;