
/**
 * 
 * @param {StructureLink} link 
 */
const buildingRoleLink = (link) => {
  /*
  ! 已于'./util_customPrototypes.js'为StructureLink定义了Rmemory属性：link在本房间中的memory.BUILDING_LINKS

  link types:
    source,
    storage,
    upgrade
  */


  let RM = link.room.memory//方便快速访问

  //* 若未定义type，进行定义
  if (_.isUndefined(link.Rmemory.type)) {

    //定义type思路：
    //寻找link周围2格内的对应建筑，storage,source,controller

    //source
    let sources = link.room.find(FIND_SOURCES)
    for (s of sources) {
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
  else {

    if (link.cooldown > 0) {
      //* 若有冷却则不继续进行
      return
    }

    let type = link.Rmemory.type

    if (type == 'source') {

      for (ID in RM.BUILDING_LINKS) {
        let otherLink = Game.getObjectById(ID)
        // console.log('otherLink: ', otherLink);
        // console.log('ID: ', ID);
        // console.log('otherLink === link: ', otherLink === link);
        if (otherLink === link) {

          continue
        }

        //TODO ! 以下部分不合理,因为没有指定搜索顺序。待修改
        if (otherLink.Rmemory.type == 'controller'
          && otherLink.store.getUsedCapacity(RESOURCE_ENERGY) < 700) {
          link.transferEnergy(otherLink)
        }

        else if (otherLink.Rmemory.type == 'storage') {
          link.transferEnergy(otherLink)
        }
      }
    } else if (type == 'storage') {

      for (ID in RM.BUILDING_LINKS) {
        let otherLink = Game.getObjectById(ID)
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


}
module.exports = buildingRoleLink