import _ from "lodash"

const MIN_ENERGY = 300

/**
 * type和Rmemory属性见此  
 * {@link "../../../mount/common/customStructurePrototypes.ts"}
 */
export const Link = (link: StructureLink) => {

  //* 若未定义type，进行定义
  if (_.isUndefined(link.type)) {
    initLinkType(link)
  }

  //* 若有冷却则不继续进行
  if (link.cooldown > 0) {
    return
  }

  //* 若能量小于MIN_ENERGY(500)则不进行传输
  if (link.store[RESOURCE_ENERGY] < MIN_ENERGY) {
    return
  }

  const type = link.type

  if (type == 'source') {

    runSourceLink(link)

  } else if (type == 'storage') {

    runStorageLink(link)

  } else if (type == 'controller') {
    //todo 待写
  }

}



/**
 * 初始化传入的link的type属性
 */
function initLinkType(link: StructureLink) {
  //定义type思路：
  //寻找link周围2格内的对应建筑，storage,source,controller

  //source
  let sources = link.room.find(FIND_SOURCES)
  for (const s of sources) {
    if (link.pos.inRangeTo(s, 2) == true) {
      link.type = 'source'
    }
  }

  //storage
  let storage = link.room.storage
  if (storage && link.pos.inRangeTo(storage, 2) == true) {
    link.type = 'storage'
  }

  //contoller
  let controller = link.room.controller
  if (controller && link.pos.inRangeTo(controller, 2) == true) {
    link.type = 'controller'
  }

  //unknow
  if (_.isUndefined(link.type)) {
    link.type = 'unknow'
  }

  return link.type
}

function runSourceLink(link: StructureLink) {
  for (const otherLink of link.room.links) {

    if (!otherLink || otherLink === link) {
      continue
    }

    //TODO ! 以下部分不合理,因为没有指定搜索顺序。待修改
    if (otherLink.type == 'controller'
      && otherLink.store.getUsedCapacity(RESOURCE_ENERGY) < 700) {
      link.transferEnergy(otherLink)
    }

    else if (otherLink.type == 'storage'
      && otherLink.store.getUsedCapacity(RESOURCE_ENERGY) < 500) {
      link.transferEnergy(otherLink)
    }

  }
}

function runStorageLink(link: StructureLink) {
  for (const otherLink of link.room.links) {

    if (!otherLink || otherLink === link) {
      continue
    }

    if (otherLink.type == 'controller'
      && otherLink.store.getUsedCapacity(RESOURCE_ENERGY) < 500) {
      link.transferEnergy(otherLink)
    }

  }
}
