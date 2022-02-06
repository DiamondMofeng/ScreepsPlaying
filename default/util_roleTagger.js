const roleTagger = (roomName = undefined) => {
  let tagger = new RoomVisual(roomName)
  for (i in Game.creeps) {
    let c = Game.creeps[i]
    tagger.text(c.memory.role, c.pos,
      {
        font: 0.3,
        align: 'left'
      })
  }
}


const main = () => {
  roleTagger()


}

module.exports = roleTagger;
