export const runObserver = (observer: StructureObserver) => {

  if (observer.Rmemory && observer.Rmemory.observeAt) {
    observer.observeRoom(observer.Rmemory.observeAt)
  }

}
