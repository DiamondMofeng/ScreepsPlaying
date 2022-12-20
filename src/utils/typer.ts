/**
 * Can be used as filter callback for convenience.
 * Solves equations of the form a * x = b
 * @example
 * // type of links is StructureLinks[]
 * let links = creep.pos.findInRange(FIND_STRUCTURES, 1).filter<StructureLink>(isStructureType(STRUCTURE_LINK));
 */
export function isStructureType<T extends AnyStructure>(structureType: T["structureType"]) {
  return (s: AnyStructure): s is T => {
    return s.structureType === structureType;
  }
}

export function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}

type resInStore<T> = T extends Store<infer R, any> ? R[] : never[];

export function resourceTypesIn<T extends Store<ResourceConstant, any>>(store: T): resInStore<T> {
  return Object.keys(store) as resInStore<T>;
}
