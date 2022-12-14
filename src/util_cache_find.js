/*
用room.spawns来查找目标而不是find后filter.
非唯一建筑类型返回数组
唯一建筑类型返回对象或undefined





*/

const findCache = () => {


  const multipleList = new Set([
    STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_ROAD, STRUCTURE_WALL,
    STRUCTURE_RAMPART, STRUCTURE_KEEPER_LAIR, STRUCTURE_PORTAL, STRUCTURE_LINK,
    STRUCTURE_TOWER, STRUCTURE_LAB, STRUCTURE_CONTAINER, STRUCTURE_POWER_BANK,
  ]);

  const singleList = new Set([
    STRUCTURE_OBSERVER, STRUCTURE_POWER_SPAWN, STRUCTURE_EXTRACTOR, STRUCTURE_NUKER,
    STRUCTURE_FACTORY, STRUCTURE_INVADER_CORE, LOOK_MINERALS,
    //STRUCTURE_TERMINAL,   STRUCTURE_CONTROLLER,   STRUCTURE_STORAGE,
  ]);


  Object.defineProperties(Room.prototype, {
    /**
     * 缓存建筑
     */
    // cacheStructures: {
    //   get() {
    //     return () => {
    //       console.log(this)
    //       let time = Game.time
    //       this.cacheTime_structures = time;

    //       let structures = _.groupBy(this.find(FIND_STRUCTURES), s => s.structureType)

    //       //* structures
    //       for (let type in structures) {
    //         console.log(type)
    //         if (singleList.has(type)) {
    //           this[type] =
    //             structures[type][0]
    //         } else if (multipleList.has(type)) {
    //           this[type + 's'] =
    //             structures[type + 's']
    //         }
    //       }
    //       return 'cached at ' + time
    //     }
    //   },
    // },

    /**
     * 缓存掉落物
     */
    cacheDrops: {
      // get() {
      //   return () => {


      //   }
      // },

    },

    cacheStatic: {
      get() {
        return () => {
          this['sources'] = this.find(FIND_SOURCES)
          this['mineral'] = this.find(FIND_MINERALS)
          // this['']=this.find(FIND_)
        }
      },
    },

    spawns: {
      get() {
        if (_.isUndefined(this._spawns)) {
          this._spawns = {
            lastFind: Game.time,

          }
        }
      },
      // set() {

      // }
    },
    cts: {
      get() {
        if (_.isUndefined(this._cts)
          || _.isUndefined(this._cacheTime_cts)
          || Game.time - this._cacheTime_cts > 100) {
          this._cts = this.find(FIND_CONSTRUCTION_SITES)
          this._cacheTime_cts = Game.time
        }
        return this._cts
      },
    },


  })








}


module.exports = findCache