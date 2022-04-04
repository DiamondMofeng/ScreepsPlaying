


//挂载控制台命令到全局对象上
const mountCLI = function () {



  /**
   * 通过fromRoom的Terminal,发送资源到toRoom的Terminal
   * @param {String|Room} fromRoom 
   * @param {String|Room} toRoom 
   * @param {String} resource 
   * @param {Number} amount 
   */
  global.Msend = function (fromRoom, toRoom, resource, amount) {
    if (!fromRoom || !toRoom || !resource || !amount) {
      console.log('参数不正确')
      return
    }
    let fromRoomName = fromRoom.name || fromRoom
    let toRoomName = toRoom.name || toRoom
    let terminal = Game.rooms[fromRoomName].terminal
    if (!terminal) {
      console.log(fromRoom, '没有terminal')
      return
    }
    let result = terminal.send(resource, amount, toRoomName, 'TEST')
    if (result == OK) {
      console.log('发送成功')
    } else {
      console.log('发送失败')
    }

  }


  //if room.controller&&room.controller.my
  global.myRoomsInfo = function () {
    for (let roomName in Game.rooms) {
      let room = Game.rooms[roomName]
      if (room.controller && room.controller.my) {
        console.log(roomName, room.controller.level, room.controller.progress, room.controller.progressTotal)
      }
    }
  }

  global.showRoomProgressPercent = function () {
    for (let roomName in Game.rooms) {
      let room = Game.rooms[roomName]
      if (room.controller && room.controller.my) {
        console.log(roomName, room.controller.level, room.controller.progress, room.controller.progressTotal, room.controller.progress / room.controller.progressTotal * 100)
      }
    }

  }

  global.consoleAbuse=function(){
    

  }
  


}

module.exports = mountCLI




