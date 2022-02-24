Game.market.createOrder('buy', RESOURCE_GHODIUM_HYDRIDE, 2.05, 10000, 'W12N16')

Game.market.createOrder('sell', PIXEL, 15000, 100)


Game.spawns.W17N15_0.spawnCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], 'B1', { memory: { role: 'builder' } })

function t1() {
  let st = Game.cpu.getUsed()
  let a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
  b = [...a].reverse()
  console.log(b.pop())
  let et = Game.cpu.getUsed()
  console.log('t1', et - st)
}

function t2() {
  let st = Game.cpu.getUsed()
  let a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
  console.log(a.shift())
  let et = Game.cpu.getUsed()
  console.log('t1', et - st)
}