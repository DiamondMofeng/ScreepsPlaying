import C from "@/utils/consts"

const { RM: _RM } = C

/**
 * 
 * @param {StructureLink} link 
 */
const buildingRoleLink = (link) => {
  /*
  ! 已于'@/utils/util_customPrototypes.js'为StructureLink定义了Rmemory属性：link在本房间中的memory.BUILDING_LINKS

  link types:
    source,
    storage,
    upgrade
  */

  const MIN_ENERGY = 300



  let RM = link.room.memory//方便快速访问

  //* 若未定义type，进行定义
  if (_.isUndefined(link.Rmemory.type)) {

    //定义type思路：
    //寻找link周围2格内的对应建筑，storage,source,controller

    //source
    let sources = link.room.find(FIND_SOURCES)
    for (const s of sources) {
      if (link.pos.inRangeTo(s, 2) == true) {
        link.Rmemory.type = 'source'
      }
    }

    //storage
    let storage = link.room.storage
    if (link.pos.inRangeTo(storage, 2) == true) {
      link.Rmemory.type = 'storage'
    }

    //contoller
    let controller = link.room.controller
    if (link.pos.inRangeTo(controller, 2) == true) {
      link.Rmemory.type = 'controller'
    }

    //unknow
    if (_.isUndefined(link.Rmemory.type)) {
      link.Rmemory.type = 'unknow'
    }


  }

  //* 若已定义memory.type:

  //* 若有冷却则不继续进行
  if (link.cooldown > 0) {
    return
  }
  //* 若能量小于MIN_ENERGY(500)则不进行传输
  if (link.store[RESOURCE_ENERGY] < MIN_ENERGY) {
    return
  }



  let type = link.Rmemory.type

  // 感觉case不如if清晰啊。。
  // switch(type){
  //   case sources:
  //     break;
  //   case storage:
  //     break;
  //   case controller:
  //     break;
  // }


  if (type == 'source') {

    for (const ID in RM[_RM.LINKS]) {
      let otherLink = Game.getObjectById(ID)
      if (otherLink == undefined) {
        delete RM[_RM.LINKS][ID]
        continue
      }

      if (otherLink === link) {
        continue
      }

      //TODO ! 以下部分不合理,因为没有指定搜索顺序。待修改
      if (otherLink.Rmemory.type == 'controller'
        && otherLink.store.getUsedCapacity(RESOURCE_ENERGY) < 700) {
        link.transferEnergy(otherLink)
      }

      else if (otherLink.Rmemory.type == 'storage'
        && otherLink.store.getUsedCapacity(RESOURCE_ENERGY) < 500) {
        link.transferEnergy(otherLink)
      }
    }

  } else if (type == 'storage') {

    for (const ID in RM[_RM.LINKS]) {
      let otherLink = Game.getObjectById(ID)
      if (otherLink == undefined) {
        delete RM[_RM.LINKS][ID]
        continue
      }
      if (otherLink === link) { continue }

      if (otherLink.Rmemory.type == 'controller'
        && otherLink.store.getUsedCapacity(RESOURCE_ENERGY) < 500) {
        link.transferEnergy(otherLink)
      }

    }

  } else if (type == 'controller') {
    //todo 待写
  }


}
export default buildingRoleLink