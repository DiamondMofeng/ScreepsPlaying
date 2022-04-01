const mountSimpleDuichuan = require("./极简对穿")
mountSimpleDuichuan()

module.exports.loop = function () {
  console.log("------------------------")

  //   console.log(Game.cpu.getUsed())

  //   Game.creeps.c2.moveTo(Game.flags.Flag1, { ignoreCreeps: true })

  for (let creep of Object.values(Game.creeps)) {

    if (creep.name == 'c2') return


    creep.moveTo(Game.flags.Flag1, { ignoreCreeps: true })
  }
  console.log(Game.cpu.getUsed())

  for (let creep of Object.values(Game.creeps)) {
    // creep.memory._lastPos = creep.pos




  }


  console.log(Game.cpu.getUsed())

}