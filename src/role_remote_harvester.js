//when spawn, add memory of certain source position to go , and bind with this source.
//出生时绑定指定能量源，并指定工作坐标（待完成）
//工作时站在container上不动，采集的资源自动掉到container里面
//[WORK*5,MOVE] COST:550

import { moveToRoom } from "./util_beheavor"
import role_harvesterPlus from './role_harvesterPlus'


//memory:
//{
//workPos:
//sourceId:
//}
var role_remote_harvester = {

  /**
   * 
   * @param {Creep} creep 
   * 
   */
  run: function (creep) {

    let CM = creep.memory

    let workRoom = CM.workRoom
    let RM = Memory.rooms[workRoom]


    if (creep.room.name != workRoom) {
      moveToRoom(creep, workRoom, true)
    }
    else {
      role_harvesterPlus(creep)
    }

  }
}

export default role_remote_harvester.run;


