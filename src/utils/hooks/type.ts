import type { PartialRecord } from "../util-types";

//TODO 把缓存key挪出到一个合适的地方

//* 为了防止获取缓存时发生混乱，直接在这里定义所有的缓存key
export type RoomCacheKey =
  | 'taskCounter'
  | 'transportTasksCounter'

export type GlobalCacheKey =
  | 'creepsCounter';

export interface RoomCache {
  data: any;
  expire: number;
}

export interface GlobalCache {
  data: any;
  expire: number;
}

declare global {
  namespace NodeJS {
    interface Global {
      __cache: {
        /** roomName:roomCache */
        roomCache?: Record<string, PartialRecord<RoomCacheKey, RoomCache>>

        globalCache?: PartialRecord<GlobalCacheKey, GlobalCache>
      };

    }
  }
}