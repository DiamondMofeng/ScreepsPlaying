
/**
 * 
 * @param {StructureObserver} observer 
 */
const Observer = (observer) => {

  if (observer.Rmemory && observer.Rmemory.observeAt) {
    observer.observeRoom(observer.Rmemory.observeAt)
  }

}

module.exports = Observer

//minCut