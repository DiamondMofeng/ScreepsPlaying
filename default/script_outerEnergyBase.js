/*
param:baseRoom,targetRoom
思路:用pos.findPathTo从storage寻找通向room内资源点的路径:

room.storage.pos.findPathTo





*/

let costMatrix = new PathFinder.CostMatrix()

let findOpt={
  ignoreCreeps:true,
  
}