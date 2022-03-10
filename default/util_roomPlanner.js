/**
 * 
 * @param {RoomVisual} v
 * @param {number} x 
 * @param {number} y 
 */
const drawExtension = (v,x,y) => {
  
}



const roomPlanner = (roomName = undefined) => {
  if (!roomName) { return }
  let V = new RoomVisual(roomName)

  for (flag of Object.values(Game.flags)) {
    //* EXT/////////////////
    if (flag.name.indexOf('EXT') !== -1) {
      let x = flag.pos.x
      let y = flag.pos.y

      let extensionPos = [
        { x: x, y: y },
        { x: x + 1, y: y },
        { x: x - 1, y: y },
        { x: x, y: y + 1 },
        { x: x, y: y - 1 }
      ]
      let roadPos = [
        { x: x + 2, y: y },
        { x: x + 1, y: y + 1 },
        { x: x + 1, y: y - 1 },
        { x: x, y: y + 2 },
        { x: x, y: y - 2 },
        { x: x - 1, y: y + 1 },
        { x: x - 1, y: y - 1 },
        { x: x - 2, y: y }
      ]

      for (pos of extensionPos) {
        V.text('ⓔ', pos.x, pos.y, { color: '#f5b400' })
      }

      for (pos of roadPos) {
        V.text('▨', pos.x, pos.y, {})
      }
    }

    //* CENTER/////////
    if (flag.name.indexOf('CENTER') !== -1) {
      let x = flag.pos.x
      let y = flag.pos.y

      let linkPos = [
        { x: x, y: y }
      ]
      let spawnPos = [
        { x: x, y: y - 2 },
        { x: x - 2, y: y + 2 },
        { x: x + 2, y: y + 2 },
      ]
      let extensionPos = [
        { x: x - 1, y: y - 2 },
        { x: x - 2, y: y - 2 },
        { x: x + 1, y: y - 2 },
        { x: x + 2, y: y - 2 },
        { x: x - 2, y: y - 1 },
        { x: x, y: y - 1 },
        { x: x + 2, y: y - 1 },
        { x: x - 1, y: y },
        { x: x + 1, y: y },
        { x: x - 2, y: y + 1 },
        { x: x, y: y + 1 },
        { x: x + 2, y: y + 1 },
        { x: x - 1, y: y + 2 },
        { x: x, y: y + 2 },
        { x: x + 1, y: y + 2 },
      ]
      let creepPos = [
        { x: x, y: y },
        { x: x, y: y },
        { x: x, y: y },
        { x: x, y: y },
      ]
      let containerPos = [
        { x: x + 2, y: y },
        { x: x - 2, y: y },
      ]
      let roadPos = [
        { x: x - 3, y: y - 3 },
        { x: x - 3, y: y - 2 },
        { x: x - 3, y: y - 1 },
        { x: x - 3, y: y },
        { x: x - 3, y: y + 1 },
        { x: x - 3, y: y + 2 },
        { x: x - 3, y: y + 3 },
        { x: x - 2, y: y + 3 },
        { x: x - 2, y: y - 3 },
        { x: x - 1, y: y + 3 },
        { x: x - 1, y: y - 3 },
        { x: x, y: y + 3 },
        { x: x, y: y - 3 },
        { x: x + 1, y: y + 3 },
        { x: x + 1, y: y - 3 },
        { x: x + 2, y: y + 3 },
        { x: x + 2, y: y - 3 },
        { x: x + 3, y: y - 3 },
        { x: x + 3, y: y - 2 },
        { x: x + 3, y: y - 1 },
        { x: x + 3, y: y },
        { x: x + 3, y: y + 1 },
        { x: x + 3, y: y + 2 },
        { x: x + 3, y: y + 3 },
      ]

      for (pos of extensionPos) {
        V.text('ⓔ', pos.x, pos.y, { color: '#f5b400' })
      }
      for (pos of linkPos) {
        V.text('◊', pos.x, pos.y, { color: '#f5b400' })
      }
      for (pos of spawnPos) {
        V.text('Ⓢ', pos.x, pos.y, { color: '#0f9d58' })
      }
      for (pos of containerPos) {
        V.text('▯', pos.x, pos.y, { color: '#f5b400' })
      }
      // for (pos of extensionPos) {
      //   V.text('ⓔ', pos.x, pos.y, { color: '#f5b400' })
      // }
      for (pos of roadPos) {
        V.text('▨', pos.x, pos.y, {})
      }
    }



    //*LABS
    if (flag.name.indexOf('LABS') !== -1) {
      let x = flag.pos.x
      let y = flag.pos.y

      let labPos = [
        { x: x - 1, y: y },
        { x: x - 1, y: y + 1 },

        { x: x, y: y - 1 },
        { x: x, y: y },
        { x: x, y: y + 2 },

        { x: x + 1, y: y - 1 },
        { x: x + 1, y: y + 1 },
        { x: x + 1, y: y + 2 },

        { x: x + 2, y: y },
        { x: x + 2, y: y + 1 },
      ]
      let roadPos = [
        { x: x + 2, y: y - 1 },
        { x: x + 1, y: y },
        { x: x, y: y + 1 },
        { x: x - 1, y: y + 2 },
      ]
      for (pos of labPos) {
        V.text('💡', pos.x, pos.y, { opacity: 0.5 })
      }
      for (pos of roadPos) {
        V.text('▨', pos.x, pos.y, {})
      }
    }


    //*STORAGES
    if (flag.name.indexOf('STORAGES') === 0) {
      let x = flag.pos.x
      let y = flag.pos.y

      let linkPos = [
        { x: x, y: y - 1 }  //上
      ]
      let storagePos = [
        { x: x - 1, y: y }  //左
      ]
      let factoryPos = [
        { x: x + 1, y: y }  //右
      ]
      let terminalPos = [
        { x: x, y: y + 1 }  //下
      ]
      let roadPos = [
        { x: x + 2, y: y },
        { x: x + 1, y: y + 1 },
        { x: x + 1, y: y - 1 },
        { x: x, y: y + 2 },
        { x: x, y: y - 2 },
        { x: x - 1, y: y + 1 },
        { x: x - 1, y: y - 1 },
        { x: x - 2, y: y }
      ]
      for (pos of linkPos) {
        V.text('◊', pos.x, pos.y, { color: '#f5b400' })
      }
      for (pos of storagePos) {
        V.text('💾', pos.x, pos.y, {})
      }

      for (pos of factoryPos) {
        V.text('🏭', pos.x, pos.y, {})
      }
      for (pos of terminalPos) {
        V.text('💰', pos.x, pos.y, {})
      }
      for (pos of roadPos) {
        V.text('▨', pos.x, pos.y, {})
      }
    }


    //*STORAGES
    if (flag.name.indexOf('TOWERS') === 0) {
      let x = flag.pos.x
      let y = flag.pos.y

      let linkPos = [
        { x: x + 1, y: y }  //右
      ]
      let towerPos = [
        { x: x - 1, y: y - 1 },
        { x: x, y: y - 1 },
        { x: x + 1, y: y - 1 },
        { x: x + 1, y: y + 1 },
        { x: x, y: y + 1 },
        { x: x - 1, y: y + 1 },
      ]
      for (pos of linkPos) {
        V.text('◊', pos.x, pos.y, { color: '#f5b400' })
      }
      for (pos of towerPos) {
        V.text('♜', pos.x, pos.y, {})
      }
    }

  }
}





















module.exports = roomPlanner;
