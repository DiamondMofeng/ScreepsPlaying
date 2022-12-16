
/**
 * 
 * @param {StructureFactory} factory 
 */
const buildingRoleFactory = (factory) => {

  //TODO 准备写成任务驱动的

  // let store = factory.store;
  // if(store[RESOURCE_ENERGY]>50*1000){
  //   factory.send(RESOURCE_ENERGY,10*1000,'W17N15','TEST')

  // }

  if (Game.time % 10 == 0) {
    // factory.produce(RESOURCE_UTRIUM_BAR);
    factory.produce(RESOURCE_ENERGY)
  }






}
module.exports = buildingRoleFactory

//minCut