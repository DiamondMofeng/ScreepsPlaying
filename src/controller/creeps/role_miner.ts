import { stayInRoomCallBack } from "@/utils/costMatrix"
import { setDoing, moveAndHarvest, moveAndTransfer } from "@/utils/util_beheavor"

const state_mining = 'mining'
const state_transfering = 'transfering'

interface MinerMemory extends CreepMemory {
  doing?: typeof state_mining | typeof state_transfering
}

export function roleMiner(creep: Creep) {

  const CM: MinerMemory = creep.memory

  const mineral = creep.room.mineral
  if (!mineral) {
    return
  }

  if (!CM.doing) {
    CM.doing = state_mining //初始化为mining
  }

  if (CM.doing == state_mining) {

    moveAndHarvest(creep, mineral)

    if (creep.store.getFreeCapacity() == 0) {
      setDoing(creep, state_transfering)
    }

  }
  else if (CM.doing == state_transfering) {
    const terminal = creep.room.terminal
    const storage = creep.room.storage

    if (storage
      && storage.store.getFreeCapacity() < 100000
      && terminal
    ) {
      moveAndTransfer(creep, terminal, undefined, undefined, { costCallback: stayInRoomCallBack })
    } else if (storage) {
      moveAndTransfer(creep, storage, undefined, undefined, { costCallback: stayInRoomCallBack })
    }

    if (creep.store.getUsedCapacity() == 0) {
      setDoing(creep, state_mining)
    }
  }


}
