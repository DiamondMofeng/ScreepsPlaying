export const Observer = (observer: StructureObserver) => {

  if (observer.Rmemory && observer.Rmemory.observeAt) {
    observer.observeRoom(observer.Rmemory.observeAt)
  }

}
