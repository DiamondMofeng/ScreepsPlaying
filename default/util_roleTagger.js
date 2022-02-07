const roleTagger = (roomName = undefined) => {
  let tagger = new RoomVisual(roomName)
  for (i in Game.creeps) {
    let c = Game.creeps[i]

    if (c.memory.role == undefined) {
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


const main = () => {
  roleTagger()


}

module.exports = roleTagger;
