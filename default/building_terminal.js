
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

  //Game.getObjectById('620b93fc1147769b1eb644c2').send(RESOURCE_ENERGY,140*1000,'W9N7','TEST')

  // Game.market.createOrder('sell', 'pixel', 19999, 100)

  //Game.rooms['W17N15'].terminal.send('K',50*1000,'E31S54')
}
module.exports = buildingRoleLink