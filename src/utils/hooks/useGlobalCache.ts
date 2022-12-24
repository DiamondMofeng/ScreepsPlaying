import type { GlobalCacheKey } from "./type";



/**
 * @danger 请不要在这里存储不可丢失的数据
 */
export function useGlobalCache<T>(key: GlobalCacheKey, initValue: T | (() => T), duration = 0): T {

  if (duration < 0) {
    throw new Error("duration must be greater than 0");
  }

  if (!global.__cache) {
    global.__cache = {};
  }

  if (!global.__cache['globalCache']) {
    global.__cache['globalCache'] = {};
  }

  const globalCache = global.__cache['globalCache'];
  if ((globalCache?.[key]?.expire ?? -1) < Game.time) {       //? 如果Game.time变成负数就会坏掉
    globalCache[key] = {
      data: (initValue instanceof Function) ? initValue() : initValue,
      expire: Game.time + duration,
    };
  }

  return globalCache[key]!.data;  //safe
}
