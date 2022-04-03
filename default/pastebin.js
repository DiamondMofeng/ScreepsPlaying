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


function test() {
  if (true) {
    var a = 1
  } else {
    var a = 2
  }
  console.log(a)  //输出1
}

function test() {
  if (true) {
    let a = 1
  } else {
    let a = 2
  }
  console.log(a)  //报错 a未定义
}

function test() {
  let a
  if (true) {
    a = 1
  } else {
    a = 2
  }
  console.log(a)  //输出1
}

/*

{"extension":{"pos":[{"x":44,"y":46},{"x":45,"y":47},{"x":45,"y":46},{"x":46,"y":46},{"x":45,"y":45},{"x":47,"y":45},{"x":47,"y":44},{"x":46,"y":44},{"x":48,"y":44},{"x":47,"y":43},{"x":45,"y":43},{"x":45,"y":42},{"x":46,"y":42},{"x":45,"y":41},{"x":44,"y":42},{"x":43,"y":45},{"x":43,"y":44},{"x":42,"y":44},{"x":43,"y":43},{"x":44,"y":44},{"x":41,"y":43},{"x":41,"y":42},{"x":40,"y":42},{"x":41,"y":41},{"x":42,"y":42},{"x":43,"y":41},{"x":43,"y":40},{"x":44,"y":40},{"x":43,"y":39},{"x":42,"y":40},{"x":41,"y":39},{"x":42,"y":38},{"x":41,"y":37},{"x":40,"y":38},{"x":40,"y":40},{"x":39,"y":39},{"x":38,"y":40},{"x":39,"y":41},{"x":37,"y":41},{"x":37,"y":43},{"x":38,"y":42},{"x":36,"y":42},{"x":39,"y":43},{"x":44,"y":38},{"x":35,"y":44},{"x":36,"y":44},{"x":35,"y":43},{"x":34,"y":44},{"x":43,"y":37},{"x":42,"y":36},{"x":43,"y":35},{"x":44,"y":36},{"x":34,"y":42},{"x":33,"y":42},{"x":32,"y":42},{"x":33,"y":43},{"x":33,"y":41},{"x":33,"y":45},{"x":32,"y":44},{"x":34,"y":45}]},"spawn":{"pos":[{"x":41,"y":38},{"x":39,"y":40},{"x":36,"y":43}]},"lab":{"pos":[{"x":45,"y":35},{"x":46,"y":35},{"x":46,"y":34},{"x":47,"y":34},{"x":47,"y":33},{"x":46,"y":32},{"x":45,"y":32},{"x":45,"y":33},{"x":44,"y":33},{"x":44,"y":34}]},"storage":{"pos":[{"x":41,"y":35}]},"terminal":{"pos":[{"x":42,"y":34}]},"link":{"pos":[{"x":41,"y":33}]},"powerSpawn":{"pos":[{"x":43,"y":36}]}}

*/

