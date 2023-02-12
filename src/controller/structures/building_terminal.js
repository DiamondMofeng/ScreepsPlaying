
/**
 * 
 * @param {StructureTerminal} terminal 
 */
const Terminal = (terminal) => {

  let store = terminal.store;
  if (store[RESOURCE_ENERGY] > 50 * 1000) {
    // terminal.send(RESOURCE_ENERGY, 10 * 1000, 'W17N15', 'TEST')
  }
}

export default Terminal