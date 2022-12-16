/**
 * 在roomName中所有creep下方显示其role。
 * @param {String} roomName 
 */
const roleTagger = (roomName = undefined) => {
  let tagger = new RoomVisual(roomName)
  for (i in Game.creeps) {
    let c = Game.creeps[i]

    if (c.memory.role == undefined) {
      continue
    }

    //if roomName is given ,then only show creep tag at that room
    if (!_.isUndefined(roomName) && c.room != Game.rooms[roomName]) {
      continue
    }

    let tagText = `${c.memory.role} `
    // let tagPos = c.pos
    // tagPos['y'] = tagPos['y']+0.5
    let tagPosX = c.pos.x
    let tagPosY = c.pos.y += 0.65

    // console.log(JSON.stringify(tagPos.y))
    tagger.text(tagText, tagPosX, tagPosY,

      {
        font: 0.3,
        align: 'center',
        opacity: 0.8
      })
  }
}


// const main = () => {
//   roleTagger()


// }

module.exports = roleTagger;
