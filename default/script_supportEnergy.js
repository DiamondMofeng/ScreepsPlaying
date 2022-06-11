const { randomInt } = require("./util_helper");


/**
 * 
 * @param {String[]} fromRoomList - 自己的房间，用于功能
 * @param {String[]} toRoomList - 
 */
function supportEnergy(fromRoomList, toRoomList) {

  if (fromRoomList.length == 0 || toRoomList.length == 0) {
    console.log('fromRoomList or toRoomList is empty');
    return;
  }

  for (let fromRoomName of fromRoomList) {
    let fromRoom = Game.rooms[fromRoomName];
    if (!fromRoom || !fromRoom.controller || !fromRoom.controller.my) {
      continue
    }

    if (!fromRoom.terminal || fromRoom.terminal.store[RESOURCE_ENERGY] < 80 * 1000) {
      continue
    }



    let toRoomName = toRoomList[randomInt(0, toRoomList.length - 1)];

    sendEnergy(fromRoomName, toRoomName, 75 * 1000)

  }

}

module.exports = supportEnergy