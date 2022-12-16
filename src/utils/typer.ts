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