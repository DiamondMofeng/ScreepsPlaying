import { moveAndBoost, isPartAllBoosted, healLower } from "@/utils/util_beheavor";
import { body } from "@/utils/util_helper";


const attack_dismental = function (fromRoomName, toFlagName) {

  const dismentaler_var = 'dismental';
  const healer_var = 'healer';

  let spawnRoom = Game.rooms[fromRoomName];

  let flag = Game.flags[toFlagName];
  if (!flag) {
    console.log('DISMENTAL flag not found:', toFlagName);
    return;
  }
  let FM = flag.memory;

  let name_dismental = 'dismental_' + fromRoomName + '_' + toFlagName;
  let name_healer = 'healer_' + fromRoomName + '_' + toFlagName;

  if (!FM[dismentaler_var]) {
    FM[dismentaler_var] = name_dismental;
    spawnRoom.pushToSpawnQueue({
      body: body([TOUGH, 12, WORK, 28, MOVE, 10]), //[ TOUGH * 12, WORK * 28, MOVE * 10 ]
      role: "dismentaler",
      target: toFlagName,
      name: name_dismental,
    })
  }


  if (!FM[healer_var]) {

    FM[healer_var] = name_healer;
    spawnRoom.pushToSpawnQueue({
      body: body([TOUGH, 12, HEAL, 28, MOVE, 10]), //[ TOUGH * 12, HEAL * 28, MOVE * 10 ]
      role: "healer",
      target: toFlagName,
      name: name_healer
    })

  }

  if (!Game.creeps[name_dismental] || !Game.creeps[name_healer]) {
    return;
  }

  let dismentaler = Game.creeps[name_dismental];
  let healer = Game.creeps[name_healer];

  if (!dismentaler) {
    delete FM[dismentaler_var];
    return;
  }

  if (!healer) {
    delete FM[healer_var];
    return;
  }

  //boost 
  //TODO 
  if (!FM.boosted1) {
    if (!isPartAllBoosted(dismentaler, WORK) || !isPartAllBoosted(healer, HEAL)) {
      // console.log('notAllBoosted')
      let lab_WORK = dismentaler.room.find(FIND_MY_STRUCTURES, { filter: s => s.structureType === STRUCTURE_LAB && s.store && s.store['XZH2O'] >= 28 * 30 })[0];
      // console.log('lab_WORK: ', lab_WORK);
      moveAndBoost(dismentaler, lab_WORK);

      let lab_HEAL = healer.room.find(FIND_MY_STRUCTURES, { filter: s => s.structureType === STRUCTURE_LAB && s.store && s.store['XLHO2'] >= 28 * 30 })[0];
      moveAndBoost(healer, lab_HEAL);
    }

    else {
      FM.boosted1 = true;
    }

    return
  }

  if (!FM.boosted2) {
    if (!isPartAllBoosted(dismentaler, TOUGH) || !isPartAllBoosted(healer, TOUGH)) {

      let lab_TOUGH = dismentaler.room.find(FIND_MY_STRUCTURES, { filter: s => s.structureType === STRUCTURE_LAB && s.store && s.store['XGHO2'] >= 12 * 30 })[0];
      console.log('lab_TOUGH: ', lab_TOUGH);
      moveAndBoost(dismentaler, lab_TOUGH);
      moveAndBoost(healer, lab_TOUGH);

    } else {
      FM.boosted2 = true;
    }
    return
  }

  if (!FM.boosted3) {
    if (!isPartAllBoosted(dismentaler, MOVE) || !isPartAllBoosted(healer, MOVE)) {
      let lab_MOVE = dismentaler.room.find(FIND_MY_STRUCTURES, { filter: s => s.structureType === STRUCTURE_LAB && s.store['XZHO2'] >= 10 * 30 })[0];
      console.log('lab_MOVE: ', lab_MOVE);
      moveAndBoost(dismentaler, lab_MOVE);
      moveAndBoost(healer, lab_MOVE);
    }
    else {
      FM.boosted3 = true;
    }
    return
  }

  //集合
  if (!FM.jijie) {
    healer.moveTo(dismentaler, { range: 1 });
    dismentaler.moveTo(healer, { range: 1 });

    if (healer.pos.getRangeTo(dismentaler) <= 1) {
      FM.jijie = true;
    }
    return;
  }


  healer.heal(dismentaler);
  healLower(healer, 3);

  //靠近
  if (dismentaler.room.name === healer.room.name) {
    if (dismentaler.pos.getRangeTo(healer) > 1) {
      dismentaler.moveTo(healer, { range: 1 });
      healer.moveTo(dismentaler, { range: 1 });
      
    }
  }


  //前往地点
  if (flag.pos.getRangeTo(dismentaler) > 1) {

    //保持同步移动
    if (dismentaler.fatigue == 0 && healer.fatigue == 0) {
      // if (dismentaler.pos.getRangeTo(healer) > 1) {
      //   //跳过移动
      // } else {
      dismentaler.moveTo(flag);
      // }
    }
    healer.moveTo(dismentaler, { ignoreCreeps: false });


  }

  //攻击
  if (flag.pos.getRangeTo(dismentaler) <= 1) {
    let target = flag.pos.lookFor(LOOK_STRUCTURES)[0];

    let desRes = dismentaler.dismantle(target);
    console.log('desRes: ', desRes);

    if (healer.pos.getRangeTo(dismentaler) > 1) {
      healer.moveTo(dismentaler, { range: 1 });
    }
    healer.heal(dismentaler);
    healLower(healer, 3);
  }









}

export default attack_dismental;