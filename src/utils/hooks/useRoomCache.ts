import type { RoomCacheKey } from "./type";

/**
 * @danger 请不要在这里存储不可丢失的数据
 */
export function useRoomCache<T>(room: Room | Room['name'], key: RoomCacheKey, initValue: T | (() => T), duration = 0): T {

  if (duration < 0) {
    throw new Error("duration must be greater than 0");
  }

  if (room instanceof Room) {
    room = room.name;
  }

  if (!global.__cache) {
    global.__cache = {};
  }

  if (!global.__cache['roomCache']) {
    global.__cache['roomCache'] = {};
  }

  if (!global.__cache['roomCache'][room]) {
    global.__cache['roomCache'][room] = {};
  }

  const roomCache = global.__cache['roomCache'][room];
  if ((roomCache?.[key]?.expire ?? -1) < Game.time) {       //? 如果Game.time变成负数就会坏掉
    roomCache[key] = {
      data: (initValue instanceof Function) ? initValue() : initValue,
      expire: Game.time + duration,
    };
  }

  return roomCache[key]!.data;  //safe
}
