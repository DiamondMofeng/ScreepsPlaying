import { useRoomCache } from "@/utils/hooks/useRoomCache";
import { isStructureType } from "@/utils/typer";

/** 
 * 用room.spawns来查找目标而不是find后filter.
 * 非唯一建筑类型返回数组, 使用时记得自己判断长度是否为0
 * 唯一建筑类型返回对象或undefined
*/

//TODO 考虑如何改善时效性

const INTERVAL_REFRESH_STRUCTURE_CACHE = 100

// 懒人写法，可以不用挨个声明属性
// 实现的可能不是很优雅，但是可以用了

type Singular<T extends string> = T extends `${infer P}s` ? P : never

type AnyCountableStructure = typeof multipleList[number]

type CountableStructuresMap = {
  [P in `${AnyCountableStructure}s`]: ConcreteStructure<Singular<P>>[];
}

type AnyUniqueStructure = typeof singleList[number]

type UniqueStructuresMap = {
  [P in AnyUniqueStructure]: ConcreteStructure<P> | undefined;
}

declare global {
  interface Room extends
    CountableStructuresMap,
    UniqueStructuresMap {
    //快速访问属性
    cts: ConstructionSite[]
    constructionSites: ConstructionSite[]

    //没法循环实现了，单独写出来
    mineral?: Mineral;
    sources: Source[]
    keeperLairs: StructureKeeperLair[]


  }
}

//? 这里以官服为准。私服可能会有不同

const permanentMultiStructureList = [
  STRUCTURE_KEEPER_LAIR
];

// const permanentMultiOtherList = new Set([
//   LOOK_SOURCES
// ]);

// const permanentSingleOtherList = new Set([
//   LOOK_MINERALS
// ]);

const multipleList = [
  STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_ROAD, STRUCTURE_WALL,
  STRUCTURE_RAMPART, STRUCTURE_LINK,
  STRUCTURE_TOWER, STRUCTURE_LAB, STRUCTURE_CONTAINER,

  // STRUCTURE_KEEPER_LAIR, //永久缓存

  // STRUCTURE_POWER_BANK,  //需要时效性
  // STRUCTURE_PORTAL,
];

const singleList = [
  STRUCTURE_OBSERVER, STRUCTURE_POWER_SPAWN, STRUCTURE_EXTRACTOR, STRUCTURE_NUKER,
  STRUCTURE_FACTORY, STRUCTURE_INVADER_CORE,

  //STRUCTURE_CONTROLLER,   //已内置
  //STRUCTURE_TERMINAL,     
  //STRUCTURE_STORAGE,
];


/**
 * 挂载永久缓存   
 * sources, mineral, keeperLair
 */
function mountPermanentCache() {

  permanentMultiStructureList.forEach((type) => {
    Object.defineProperty(Room.prototype, `${type}s`, {
      get() {
        return useRoomCache(
          this,
          `${type}s`,
          () => this
            .find(FIND_STRUCTURES, { filter: isStructureType(type) }) //TODO 好像find过多次了，可以把大find提出来。不过会更加损失时效性
            .map((structure) => structure.id),
          Infinity  //永久缓存
        )
          .map((id) => Game.getObjectById(id))

      }
    } as PropertyDescriptor & ThisType<Room>)
  })

  Object.defineProperty(Room.prototype, `${LOOK_SOURCES}s`, {
    get() {

      return useRoomCache(
        this,
        `${LOOK_SOURCES}s`,
        () => this
          .find(FIND_SOURCES)
          .map((source) => source.id),
        Infinity  //永久缓存
      )
        .map((id) => Game.getObjectById(id))

    }
  } as PropertyDescriptor & ThisType<Room>)

  Object.defineProperty(Room.prototype, `${LOOK_MINERALS}`, {
    get() {
      return Game.getObjectById(
        useRoomCache(
          this,
          `${LOOK_MINERALS}`,
          () => this.find(FIND_MINERALS)[0].id,
          Infinity  //永久缓存
        )
      )

    }
  } as PropertyDescriptor & ThisType<Room>)

}


/**
 * 挂载复数建筑缓存
 */
function mountMultiStructureCache() {
  multipleList.forEach((type) => {
    Object.defineProperty(Room.prototype, `${type}s`, {
      get() {
        return useRoomCache(
          this,
          `${type}s`,
          () => this
            .find(FIND_STRUCTURES)                //TODO 好像find过多次了，可以把大find提出来。不过会更加损失时效性
            .filter(isStructureType(type))
            .map((structure) => structure.id),
          INTERVAL_REFRESH_STRUCTURE_CACHE
        )
          .map((id) => Game.getObjectById(id))

      }
    } as PropertyDescriptor & ThisType<Room>)
  });
}


/**
 * 挂载不可数建筑缓存
 */
function mountSingleStructureCache() {
  singleList.forEach((type) => {
    Object.defineProperty(Room.prototype, `${type}`, {
      get() {
        return Game.getObjectById(
          useRoomCache(
            this,
            `${type}`,
            () => this.find(FIND_STRUCTURES)      //TODO 好像find过多次了，可以把大find提出来。不过会更加损失时效性
              .filter(isStructureType(type))[0]
              .id,
            INTERVAL_REFRESH_STRUCTURE_CACHE
          )
        )

      }
    } as PropertyDescriptor & ThisType<Room>)
  });
}




/**
 * 挂载房间内建筑缓存
 */
export const mountStructureCache = () => {

  mountPermanentCache();
  mountMultiStructureCache();
  mountSingleStructureCache();

  Object.defineProperties(Room.prototype, {

    /**
     * 手动刷新缓存
     */
    updateStructureCache: {
      value: function () {

        //TODO

      }
    },

    updatePermanentCache: {
      value: function () {
        //TODO
      },
    },

    constructionSites: {
      get() {
        return useRoomCache(
          this,
          `cts`,
          () => this
            .find(FIND_CONSTRUCTION_SITES)
            .map((cs) => cs.id),
          INTERVAL_REFRESH_STRUCTURE_CACHE
        ).map(Game.getObjectById)
      },
    },

    cts: {
      get() {
        return this.constructionSites
      }
    },


  } as PropertyDescriptorMap & ThisType<Room>)








}
