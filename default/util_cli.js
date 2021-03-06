
let toMount = {};

/**
 * 通过fromRoom的Terminal,发送资源到toRoom的Terminal
 * @param {String|Room} fromRoom 
 * @param {String|Room} toRoom 
 * @param {String} resource 
 * @param {Number} amount 
 */
toMount.Msend = function (fromRoom, toRoom, resource, amount) {
  if (!fromRoom || !toRoom || !resource || !amount) {
    console.log('参数不正确')
    return
  }
  let fromRoomName = fromRoom.name || fromRoom
  let toRoomName = toRoom.name || toRoom
  let terminal = Game.rooms[fromRoomName].terminal
  if (!terminal) {
    return `${fromRoom}没有terminal`
  }
  let result = terminal.send(resource, amount, toRoomName, 'TEST')
  if (result == OK) {
    return '发送成功'
  } else {
    return '发送失败'
  }

}


//if room.controller&&room.controller.my
toMount.myRoomsInfo = function () {
  for (let roomName in Game.rooms) {
    let room = Game.rooms[roomName]
    if (room.controller && room.controller.my) {
      console.log(roomName, room.controller.level, room.controller.progress, room.controller.progressTotal)
    }
  }
}

toMount.showRoomProgressPercent = function () {
  for (let roomName in Game.rooms) {
    let room = Game.rooms[roomName]
    if (room.controller && room.controller.my) {
      console.log(roomName, room.controller.level, room.controller.progress, room.controller.progressTotal, room.controller.progress / room.controller.progressTotal * 100)
    }
  }

}

toMount.consoleAbuse = function () {


}

toMount.dealAll = function (orderID, roomName) {
  let amount = Game.market.getOrderById(orderID).remainingAmount
  return Game.market.deal(orderID, amount, roomName)
}

toMount.sellEnergy = function (roomName, orderID = undefined) {

  if (!Game.rooms[roomName] || !Game.rooms[roomName].controller || !Game.rooms[roomName].controller.my || !Game.rooms[roomName].terminal) {
    return `${roomName} is not my room or do not have terminal`
  }

  if (!orderID) {
    //TODO 自动寻找合适的order
  }

  let fromRoom = Game.rooms[roomName]
  let order = Game.market.getOrderById(orderID)
  if (!order) {
    return `${orderID} is not exist`
  }
  let costUnit = 1 + Game.market.calcTransactionCost(1000, roomName, order.roomName) / 1000
  let canSellAmount = Math.floor(fromRoom.terminal.store[RESOURCE_ENERGY] / costUnit)
  if (canSellAmount < order.amount) {
    Game.market.deal(orderID, canSellAmount, roomName)
    return `${canSellAmount} energy has been sold`
  }
  else {
    Game.market.deal(orderID, order.amount, roomName)
    return `${order.amount} energy has been sold`
  }


}

toMount.findCheapestOrder = function (resourceType, roomName) {
  let orders = Game.market.getAllOrders({ type: ORDER_BUY, resourceType: resourceType })
  let minPrice = Infinity
  let minOrder = null
  for (let order of orders) {
    if (order.price < minPrice) {
      minPrice = order.price
      minOrder = order
    }
  }
  if (minOrder) {
    console.log(minOrder.price, minOrder.remainingAmount, minOrder.roomName)
    return minOrder
  }
}


toMount.sendEnergy = function (fromRoom, toRoom, amount) {
  let costUnit = 1 + Game.market.calcTransactionCost(1000, fromRoom, toRoom) / 1000

  let canSendAmount = Math.floor(amount / costUnit)

  let terminal = Game.rooms[fromRoom].terminal
  if (!terminal) {
    console.log(fromRoom, '没有terminal')
    return
  }
  let result = terminal.send(RESOURCE_ENERGY, canSendAmount, toRoom, 'TEST')
  if (result == OK) {
    console.log('发送成功')
  }
  else {
    console.log('发送失败')
  }


}





toMount.clearAllSpawnQueue = function () {
  for (let room of Object.values(Game.rooms)) {
    if (room.controller && room.controller.my) {
      if (room.memory.spawnQueue) {
        delete room.memory.spawnQueue
      }
    }
  }
  return "已清除所有房间的spawnQueue"
}

toMount.killAllCreeps = function () {
  for (let name in Game.creeps) {
    let creep = Game.creeps[name]
    creep.suicide()
  }
}

toMount.cleanNonMyRoomMemory = function (sure) {
  let list = []
  for (let roomName in Memory.rooms) {
    if (_.isUndefined(Game.rooms[roomName])) {
      list.push(roomName);
    }
  }
  if (list.length == 0) {
    return "no room to clean"
  }
  if (sure !== true) {
    return `!!!!!! ${list} 's memory will be clean! use 'cleanNonMyRoomMemory(true)' to confirm clean!!!!!!`
  }

  for (let roomName of list) {
    delete Memory.rooms[roomName]
  }
  return `memory of ${list} has been cleaned !!!!!!`
}


toMount.online = function () {
  toMount.lastOnline = Game.time
}



//挂载控制台命令到全局对象上
const mountCLI = function () {

  for (let key in toMount) {
    global[key] = toMount[key]
  }

}


module.exports = mountCLI




