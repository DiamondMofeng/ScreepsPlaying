/**
 * Better version of Array.includes().  
 * You can use this for narrowing down types.
 */
export function includes<T extends U, U>(arr: ReadonlyArray<T>, item: U): item is T {
  return arr.includes(item as T);
}

/**
 * Looser version of Array.concat().  
 * Concatenating arrays of different types.
 */
export function looseConcat<T, U>(arr1: T[], ...items: (T | U | ConcatArray<T | U>)[]): (T | U)[] {
  return (arr1 as (T | U)[]).concat(...items);
}

/**
 * Can be used as filter callback for convenience.
 * Solves equations of the form a * x = b
 * @example
 * // type of links is StructureLinks[]
 * let links = creep.pos.findInRange(FIND_STRUCTURES, 1).filter<StructureLink>(isStructureType(STRUCTURE_LINK));
 */
export function isStructureType<T extends AnyStructure["structureType"]>(structureType: T) {
  return (s: AnyStructure): s is ConcreteStructure<T> => {
    return s.structureType === structureType;
  }
}

export function isStructureTypeAmong<T extends AnyStructure["structureType"]>(structureTypes: T[]) {
  return (s: AnyStructure): s is ConcreteStructure<T> => {
    return includes(structureTypes, s.structureType);
  }
}

export function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}

export type resInStore<T> = T extends Store<infer R, any> ? R[] : never[];

export function resourceTypesIn<T extends Store<ResourceConstant, any>>(store: T): resInStore<T> {
  return Object.keys(store) as resInStore<T>;
}

