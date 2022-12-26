/*
默认的memory:共5种
* Flag.memory
* Spawn.memory
* Creep.memory
* PowerCreep.memory
* Room.memory

! Rmemory 代指 记忆存储在所属本房间下
如：Link.Rmemory==Link.room.memory['BUINDING_LINK'][Link.id]
*/

import _ from "lodash"

type StructureMemoryMap = {
  [P in StructureConstant]: any
}

type ContainerType = 'source' | 'storage' | 'controller' | 'unknown'
type LinkType = 'source' | 'storage' | 'controller' | 'unknow'
type LabType = 'boost' | 'reaction' | 'raw'

declare global {
  interface RoomMemory extends StructureMemoryMap { }

  interface Structure {
    Rmemory: any
  }

  interface StructureLink {
    type: LinkType
  }

  interface StructureContainer {
    type: ContainerType
  }

  interface StructureLab {
    type: LabType
  }
}


export const mountStructurePrototypes = () => {

  //* 全建筑定义
  Object.defineProperties(Structure.prototype, {
    /**
     * Rmemory -> Memory.rooms[this.room.name][this.structureType][this.id]
     */
    Rmemory: {
      get(): any {
        if (_.isUndefined(this.room.memory[this.structureType])) {
          this.room.memory[this.structureType] = {}
        }

        if (_.isUndefined(this.room.memory[this.structureType][this.id])) {
          //TODO 初始化成带id的没有规范
          this.room.memory[this.structureType][this.id] = {
            '_id': this.id,
          }
        }
        return this.room.memory[this.structureType][this.id]
      },
      set(value) {
        (this.room.memory[this.structureType] ?? (this.room.memory[this.structureType] = {}))[this.id] = value
      },
      configurable: true,
      enumerable: false
    },
  } as PropertyDescriptorMap & ThisType<Structure>)


  //* CONTAINER
  Object.defineProperties(StructureContainer.prototype, {

    type: {
      get(): ContainerType {
        if (!_.isUndefined(this.Rmemory && this.Rmemory.type)) {
          return this.Rmemory.type
        }
        else {
          let sources = this.room.find(FIND_SOURCES)
          for (const s of sources) {
            if (this.pos.inRangeTo(s, 2) == true) {
              this.Rmemory.type = 'source'
            }
          }

          //storage
          let storage = this.room.storage
          if (storage && this.pos.inRangeTo(storage, 2) == true) {
            this.Rmemory.type = 'storage'
          }

          //contoller
          let controller = this.room.controller
          if (controller && this.pos.inRangeTo(controller, 2) == true) {
            this.Rmemory.type = 'controller'
          }
          //mineral
          let mineral = this.room.find(FIND_MINERALS)[0]
          if (this.pos.inRangeTo(mineral, 2) == true) {
            this.Rmemory.type = 'mineral'
          }

          //unknow
          if (_.isUndefined(this.Rmemory.type)) {
            this.Rmemory.type = 'unknown'
          }
          // this.Rmemory.type
          return this.Rmemory.type
        }

      },
      set(value) { this.Rmemory.type = value },
      configurable: true,
      enumerable: true
    }
  } as PropertyDescriptorMap & ThisType<StructureContainer>)

  //* Link 和 Lab 的 type
  //TODO 未初始化！！

  Object.defineProperties(StructureLink.prototype, {
    type: {
      get(): LinkType {
        return this.Rmemory.type
      },
      set(value) { this.Rmemory.type = value },
      configurable: true,
      enumerable: true
    },
  } as PropertyDescriptorMap & ThisType<StructureLink>)

  Object.defineProperties(StructureLab.prototype, {
    type: {
      get(): LabType {
        return this.Rmemory.type
      },
      set(value) { this.Rmemory.type = value },
      configurable: true,
      enumerable: true
    },
  } as PropertyDescriptorMap & ThisType<StructureLab>)

}
