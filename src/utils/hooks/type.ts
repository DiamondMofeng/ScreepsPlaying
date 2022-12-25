import type { PartialRecord } from "../util-types";

//TODO 把缓存key挪出到一个合适的地方

//TODO 想一个记录key的好办法
export type RoomCacheKey = string

export type GlobalCacheKey = string

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