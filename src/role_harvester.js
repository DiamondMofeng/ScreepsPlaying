const { prioritySelect } = require('./util_beheavor')


var roleHarvester = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.store.getFreeCapacity() > 0) {
      var sources = creep.room.find(FIND_SOURCES);
      // console.log('source',sources)
      if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
      }
    }
    else {
      var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (
            structure.structureType == STRUCTURE_CONTAINER ||
            structure.structureType == STRUCTURE_EXTENSION ||
            structure.structureType == STRUCTURE_SPAWN ||
            structure.structureType == STRUCTURE_TOWER
          ) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
      });

      // console.log(targets)
      // console.log(targets[1])


      const priorTarget = prioritySelect(targets,
        [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER, STRUCTURE_CONTAINER],
        (s) => s.structureType,
        false
      )

      if (priorTarget) {

        // console.log('HarvesterTarget' + priorTarget)

        if (creep.transfer(priorTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(priorTarget, { visualizePathStyle: { stroke: '#ffffff' } });
        }
      }

    }
  }
}

module.exports = roleHarvester.run;


