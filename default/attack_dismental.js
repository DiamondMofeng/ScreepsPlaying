const { body } = require("./util_helper");


const attack_dismental = function (fromRoomName, toFlagName) {

  const dismentaler = 'dismental';
  const heal = 'healer';

  let spawnRoom = Game.rooms[fromRoomName];

  let flag = Game.flags[toFlagName];

  let FM = flag.memory;

  let name_dismental = 'dismental_' + fromRoomName + '_' + toFlagName;
  let name_healer = 'healer_' + fromRoomName + '_' + toFlagName;

  if (!FM[dismentaler]) {
    FM[dismentaler] = name_dismental;
    spawnRoom.pushToSpawnQueue({
      body: body([TOUGH, 12, WORK, 28, MOVE, 10]), //[ TOUGH * 12, WORK * 28, MOVE * 10 ]
      role: "dismentaler",
      target: toFlagName,
      name: name_dismental,
    })
  }


  if (!FM[heal]) {

    FM[heal] = name_healer;
    spawnRoom.pushToSpawnQueue({
      body: body([TOUGH, 12, HEAL, 12, MOVE, 10]), //[ TOUGH * 12, HEAL * 28, MOVE * 10 ]
      role: "healer",
      target: toFlagName,
      name: name_healer
    })

  }

  if (!Game.creeps[name_dismental] || !Game.creeps[name_healer]) {
    return;
  }

  let dismental = Game.creeps[name_dismental];
  let healer = Game.creeps[name_healer];

  //去boost
  //TODO

  //集合
  if (!FM.jijie) {
    healer.moveTo(dismental, { range: 1 });
    dismental.moveTo(healer, { range: 1 });

    if (healer.pos.getRangeTo(dismental) <= 1) {
      FM.jijie = true;
    }
    return;
  }

  //前往地点
  
  dismental.moveTo(flag);
  healer.moveTo(dismental, { range: 1 });









}

module.exports = attack_dismental;