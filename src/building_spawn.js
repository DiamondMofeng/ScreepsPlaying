//import

// interface CreepToSpawn {

//   body: BodyPartConstant[];
//   name: string;
//   role?: string;
//   memory: Object;
//   spawnOpt?: SpawnOptions;

//   priority: number;
// }



// /**
//  * 将Creep插入到arr末端,并通过其priority属性上浮排序至合适位置。  
//  * 注：这是一个大顶堆。
//  * @param {CreepToSpawn[]} queue 
//  * @param {CreepToSpawn} creep 
//  */
// function pushAndBubbleUp(queue, creep) {
//   queue.push(creep)
//   let i = queue.length - 1
//   while (i > 0) {
//     let parent = (i - 1) >> 1
//     if (queue[parent].priority < queue[i].priority) {
//       let temp = queue[parent]
//       queue[parent] = queue[i]
//       queue[i] = temp
//     }
//     else {
//       break
//     }
//   }
// }


// /**
//  * 获取room的spawnQueue。这是一个大顶堆
//  * @param {Room|String} room 
//  * @returns {CreepToSpawn[]} spawnQueue
//  */
// function getSpawnQueue(room) {
//   if (typeof room === 'string') {
//     room = Game.rooms[room]
//   }
//   if (!room instanceof Room) {
//     throw new Error('room must be a Room or a String')
//   }

//   if (!room.memory.spawnQueue) {
//     room.memory.spawnQueue = [];
//   }
//   return room.memory.spawnQueue;

// }


// /**
//  * 从spawn的Room的spawnQueue中尝试生成creep
//  * @param {StructureSpawn} spawn 
//  */
// function spawnFromQueue(spawn) {

//   let creepToSpawn = getSpawnQueue(spawn.room)[0]
//   if (creepToSpawn) {
//     let memory = { ...creepToSpawn.memory, role: creepToSpawn.role }
//     let opt = { ...creepToSpawn.opt, memory: memory }
//     let spawnRes = spawn.spawnCreep(creepToSpawn.body, creepToSpawn.name, { ...opt, dryRun: false })
//     if (spawnRes == OK) {
//       getSpawnQueue(spawn.room).shift()
//     }
//     return spawnRes
//   }

// }



/**
 * 
 * @param {StructureSpawn} spawn 
 */
const Spawn = (spawn) => {

  if (spawn.spawning) {
    return;
  }

  spawn.spawnFromQueue()

}
module.exports = Spawn

//StructureSpawn spawnQueue