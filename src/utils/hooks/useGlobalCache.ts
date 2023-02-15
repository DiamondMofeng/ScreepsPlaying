import type { GlobalCacheKey } from "./type";



/**
 * @danger 请不要在这里存储不可丢失的数据
 * set duration to negative to make it never expire
 */
export function useGlobalCache<T>(key: GlobalCacheKey, initValue: T | (() => T), duration = 0): T {

  global.__cache ??= {};
  global.__cache['globalCache'] ??= {};

  const globalCache = global.__cache['globalCache'];

  // delete if expired
  if (duration >= 0 && (globalCache?.[key]?.expire ?? -1) < Game.time) {
    delete globalCache[key];
  }

  globalCache[key] ??= {
    data: (initValue instanceof Function) ? initValue() : initValue,
    expire: Game.time + duration,
  };

  return globalCache[key]!.data;  //safe
}
