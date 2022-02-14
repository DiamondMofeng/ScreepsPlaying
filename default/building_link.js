
/**
 * 
 * @param {StructureLink} link 
 */
const buildingRoleLink = (link) => {
  /*
  ! 已于'./util_customPrototypes.js'为S

  link types:
    source,
    storage,
    upgrade
  */


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