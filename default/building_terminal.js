
/**
 * 
 * @param {StructureTerminal} terminal 
 */
const buildingRoleLink = (terminal) => {
  
  let store=terminal.store;
  if(store[RESOURCE_ENERGY]>50*1000){
    terminal.send(RESOURCE_ENERGY,10*1000,'W17N15','TEST')

  }


  //Game.getObjectById('620b93fc1147769b1eb644c2').send('U',10*1000,'E13S13','TEST')



}
module.exports = buildingRoleLink