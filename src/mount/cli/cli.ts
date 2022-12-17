import { calcEnergyRealPrice } from "@/utils/util_helper";

/**
 * 通过fromRoom的Terminal,发送资源到toRoom的Terminal
 */
export const Msend = function (fromRoom: string | Room, toRoom: string | Room, resource: ResourceConstant, amount: number) {
  if (!fromRoom || !toRoom || !resource || !amount) {
    console.log('参数不正确')
    return
  }
  if (fromRoom instanceof Room) {
    fromRoom = fromRoom.name
  }
  if (toRoom instanceof Room) {
    toRoom = toRoom.name
  }
  let terminal = Game.rooms[fromRoom].terminal
  if (!terminal) {
    return `${fromRoom}没有terminal`
  }
  let result = terminal.send(resource, amount, toRoom, 'TEST')
  if (result == OK) {
    return '发送成功'
  } else {
    return '发送失败'
  }

}


//if room.controller&&room.controller.my
export const myRoomsInfo = function () {
  for (let roomName in Game.rooms) {
    let room = Game.rooms[roomName]
    if (room.controller && room.controller.my) {
      console.log(roomName, room.controller.level, room.controller.progress, room.controller.progressTotal)
    }
  }
}

export const showRoomProgressPercent = function () {
  for (let roomName in Game.rooms) {
    let room = Game.rooms[roomName]
    if (room.controller && room.controller.my) {
      console.log(roomName, room.controller.level, room.controller.progress, room.controller.progressTotal, room.controller.progress / room.controller.progressTotal * 100)
    }
  }

}

// toMount.consoleAbuse = function () {


// }

export const dealAll = function (orderID: string, roomName: string) {
  let order = Game.market.getOrderById(orderID);
  if (!order) { return }
  let amount = order.remainingAmount
  return Game.market.deal(orderID, amount, roomName)
}

export const sellEnergy = function (roomName: string, orderID?: string) {
  const room = Game.rooms[roomName]

  if (!room.controller?.my || !room.terminal) {
    return `${roomName} is not my room or do not have terminal`
  }
  if (Game.rooms[roomName].terminal?.cooldown) {
    return `${roomName} terminal is cooling`
  }

  if (!orderID) {
    //TODO 自动寻找合适的order 算法是否合适？
    //TODO use cache
    const energyBuyOrders = Game.market.getAllOrders({ type: ORDER_BUY, resourceType: RESOURCE_ENERGY });
    energyBuyOrders.sort((o2, o1) => calcEnergyRealPrice(o1.price, roomName, o1.roomName) - calcEnergyRealPrice(o2.price, roomName, o2.roomName))
    orderID = energyBuyOrders[0].id
  }

  let order = Game.market.getOrderById(orderID)
  if (!order) {
    return `order ${orderID} is not exist`
  }
  if (!order.roomName) {
    return `order ${orderID} do not have a roomName`
  }
  let costUnit = 1 + Game.market.calcTransactionCost(1000, roomName, order.roomName) / 1000
  let canSellAmount = Math.min(
    Math.floor(room.terminal.store[RESOURCE_ENERGY] / costUnit),
    order.amount
  );

  Game.market.deal(orderID, canSellAmount, roomName)
  return `${canSellAmount} energy has been sold`

}

// //TODO 没考虑距离
// export const findCheapestOrder = function (resourceType: ResourceConstant, roomName?: string) {
//   let orders = Game.market.getAllOrders({ type: ORDER_BUY, resourceType: resourceType })
//   let minPrice = Infinity
//   let minOrder = null
//   for (let order of orders) {
//     if (order.price < minPrice) {
//       minPrice = order.price
//       minOrder = order
//     }
//   }
//   if (minOrder) {
//     console.log(minOrder.price, minOrder.remainingAmount, minOrder.roomName)
//     return minOrder
//   }
// }


export const sendEnergy = function (fromRoom: string, toRoom: string, amount: number) {

  if (!amount) {
    return `please provide amount`
  }

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





export const clearAllSpawnQueue = function () {
  for (let room of Object.values(Game.rooms)) {
    if (room.controller && room.controller.my) {
      if (room.memory.spawnQueue) {
        room.memory.spawnQueue = [];
      }
    }
  }
  return "已清除所有房间的spawnQueue"
}

export const killAllCreeps = function () {
  for (let name in Game.creeps) {
    let creep = Game.creeps[name]
    creep.suicide()
  }
}

export const cleanNonMyRoomMemory = function (sure?: boolean) {
  let noVisionRoomList = Object.keys(Memory.rooms).filter((roomName) => !Game.rooms[roomName]);
  if (noVisionRoomList.length == 0) {
    return "no room to clean"
  }
  if (sure !== true) {
    return `!!!!!! ${noVisionRoomList} 's memory will be clean! use 'cleanNonMyRoomMemory(true)' to confirm clean!!!!!!`
  }

  for (let roomName of noVisionRoomList) {
    delete Memory.rooms[roomName]
  }
  return `memory of ${noVisionRoomList} has been cleaned !!!!!!`
}


export const online = function () {
  global.lastOnline = Game.time
}


export const cli = {
  myRoomsInfo, showRoomProgressPercent,

  Msend,
  sendEnergy,
  dealAll, sellEnergy,
  // findCheapestOrder,

  clearAllSpawnQueue,
  killAllCreeps, cleanNonMyRoomMemory,

  online
}


//挂载控制台命令到全局对象上
//TODO 可以用下面的方法来方便global的类型检查
const mountCLI = function () {
  Object.assign(global, cli);
  // for (let key in cli) {
  //   global[key] = cli[key]
  // }

}


export default mountCLI