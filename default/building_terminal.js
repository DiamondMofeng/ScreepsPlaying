
/**
 * 
 * @param {StructureTerminal} terminal 
 */
const buildingRoleLink = (terminal) => {

  let store = terminal.store;
  if (store[RESOURCE_ENERGY] > 50 * 1000) {
    terminal.send(RESOURCE_ENERGY, 10 * 1000, 'W17N15', 'TEST')

  }


  //Game.getObjectById('620b93fc1147769b1eb644c2').send('U',10*1000,'E13S13','TEST')

  //Game.getObjectById('620b93fc1147769b1eb644c2').send(RESOURCE_ENERGY,140*1000,'W17N15','TEST')

  //Game.getObjectById('620b93fc1147769b1eb644c2').send('U',100*1000,'E39S51','TEST')

  //Game.getObjectById('620b93fc1147769b1eb644c2').send(RESOURCE_ENERGY,140*1000,'W12N2','TEST')
}
module.exports = buildingRoleLink