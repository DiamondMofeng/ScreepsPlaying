import { pickUpNearbyDroppedEnergy, moveAndWithdraw, moveAndTransfer, repireNearbyRoad, moveToRoom, setDoing } from './util_beheavor'


//TODO 写的乱死了。。希望能重构一下
var role_remote_carrier = {

  /**
   * creep从记忆中的指定容器搬运至另一指定容器
   * @param {Creep} creep
   */
  run: function (creep) {

    let CM = creep.memory

    let workRoom = CM.workRoom
    let RM = Memory.rooms[workRoom]

    let spawnRoom = CM.spawnRoom


    //把可用项存入memory
    let remote_carrier_fromContainerIDs = 'remote_carrier_fromContainerIDs'
    let remote_carrier_toContainerID = 'remote_carrier_toContainerID'

    let energyBase_containers = 'energyBase_containers'
    if (_.isUndefined(CM[remote_carrier_fromContainerIDs])) {
      CM[remote_carrier_fromContainerIDs] = []
      for (const c of RM[energyBase_containers]) {
        // console.log('c: ', JSON.stringify(c));
        CM[remote_carrier_fromContainerIDs].push(c.id)
      }
    }

    //* 默认为出生房间的storage
    if (_.isUndefined(CM[remote_carrier_toContainerID])) {
      CM[remote_carrier_toContainerID] = Game.rooms[spawnRoom].storage.id
    }


    //从memory的可用项中确定
    let toContainer = Game.getObjectById(CM[remote_carrier_toContainerID])
    //根据可取用能量的数量确定一下fromContainer
    let fromContainer //



    let remote_carrier_fromContainerID = 'remote_carrier_fromContainerID' //TODO 声明的位置乱死了





    //* MAIN




    //若处于 获取能量状态：(此时应有：背包未满)
    if (!creep.memory.working) {



      //尝试捡周围掉落的能量
      pickUpNearbyDroppedEnergy(creep)

      moveToRoom(creep, workRoom, true)



      if (!CM[remote_carrier_fromContainerID]) {

        for (const cID of CM[remote_carrier_fromContainerIDs]) {
          let c = Game.getObjectById(cID)   //? 这个时候丢了视野怎么办
          if (c.store.getUsedCapacity() > 350) {  //TODO 不合理啊，待优化，根据这个罐子负责的carrier来调节
            CM[remote_carrier_fromContainerID] = c.id
            break
          }
        }

      }



      fromContainer = Game.getObjectById(CM[remote_carrier_fromContainerID])

      moveAndWithdraw(creep, fromContainer)     //! 这个占的CPU多
      // console.log('debug')



      //若能量为满，置为工作状态
      if (creep.store.getFreeCapacity() == 0) {
        creep.memory.working = true
      }




    }

    //获取能量结束，开始工作直至背包清空


    else {
      setDoing(creep, 'transfer back')

      //清除记忆中的fromContainer
      if (fromContainer) {
        fromContainer = null
      }

      moveAndTransfer(creep, toContainer, [], {})
      // console.log('moveAndTransfer(creep, toContainer): ', moveAndTransfer(creep, toContainer));
      // console.log('debug2')

      //添加修路逻辑
      if (creep.room !== toContainer.room) {

        repireNearbyRoad(creep)

      }


      //若能量为空，置为获取能量状态
      if (creep.store.getUsedCapacity() == 0) {
        creep.memory.working = false
      }


    }



  }
}

export default role_remote_carrier.run;


