
/**
 * 
 * @param {StructureFactory} factory 
 */
const buildingRoleFactory = (factory) => {

  //TODO 准备写成任务驱动的

  if (Game.time % 10 == 0) {
    // factory.produce(RESOURCE_UTRIUM_BAR);
    factory.produce(RESOURCE_ENERGY)
  }

}
export default buildingRoleFactory

//minCut