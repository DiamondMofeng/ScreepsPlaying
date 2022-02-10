
/**
 * 
 * @param {StructureLink} link 
 */
const buildingRoleLink = (link) => {
  /*
  link types:
    source,
    storage,
    upgrade
  */

  // 在原型方法中，"this" 通常代指该原型对象本身
  // 无论你在哪个 creep 上调用 '.sayHello()' 都可以执行这段代码

  // if (!StructureLink.prototype.memory) {
  //   StructureLink.prototype.memory = this.room.memory.BUILDING_LINKS[this.id]
  // }


  console.log(link.id)


  let RM = link.room.memory

  //* 若未定义，进行定义
  if (_.isUndefined(RM.BUILDING_LINKS)) {
    RM.BUILDING_LINKS = {}

    let linksInRoom = link.room.find(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_LINK })

    for (l of linksInRoom) {

      let id = l.id
      let linkType = ''

      RM.BUILDING_LINKS[id] = {
        type: linkType
      }
    }
  }

  //* 若已定义memory.type:
  else {

    if (link.cooldown > 0) {
      //* 若有冷却则不继续进行
      return
    }

    let type = RM.BUILDING_LINKS[link.id].type

    if (type == 'source') {

      for (ID in RM.BUILDING_LINKS) {
        let otherLink = Game.getObjectById(ID)
        if (otherLink !== link && RM.BUILDING_LINKS[ID].type == 'storage') {
          link.transferEnergy(otherLink)
        }
      }
    } else if (type == 'storage') {
      //todo 待写

    } else if (type == 'upgrade') {
      //todo 待写
    }
  }


}
module.exports = buildingRoleLink