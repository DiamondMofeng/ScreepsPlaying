const getEnergyFromContainer = (creep) => {

	const findContainer = (creep) => {
		return creep.room.find(FIND_STRUCTURES, {
			filter: (structure) => {
				return structure.structureType == STRUCTURE_CONTAINER && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 100;
			}
		})
	}

	if (findContainer(creep).length) {
		const container = findContainer(creep)[0]
		if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
			creep.moveTo(container, { visualizePathStyle: { stroke: '#ffaa00' } });
		}
		return true
	}
	else { return false }

}


// const findContainer = (creep) => {
// 	return creep.room.find(FIND_MY_STRUCTURES, {
// 		filter: (structure) => {
// 			return structure.structureType == STRUCTURE_CONTAINER && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 100;
// 		}
// 	})
// }

// const getEnergyFromContainer = (creep => {
// 	const container = findContainer(creep)[0]
// 	if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
// 		creep.moveTo(container, { visualizePathStyle: { stroke: '#ffaa00' } });
// 	}
// })

var roleBuilder = {

	/** @param {Creep} creep **/
	run: function (creep) {

		// const PriorizedBuildTarget = (buildTargets) => {
		// 	//默认按放置顺序建造
		// 	for (t in buildTargets) {
		// 		// switch (t) {
		// 		// 	case :
		// 		// 		break
		// 		// 	default:
		// 		// 		break
		// 		// }
		// 	}
		// }

		if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
			creep.memory.building = false;
			creep.say('🔄 Collect Energy');//	
		}
		if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
			creep.memory.building = true;
			creep.say('🚧 build');
		}

		if (creep.memory.building) {
			var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
			if (targets.length) {
				if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
				}
			}
		}
		else {
			if (getEnergyFromContainer(creep)) {

			}
			else {//dig
				var sources = creep.room.find(FIND_SOURCES);

				if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
					creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
				}
			}
		}
	}
};

module.exports = roleBuilder.run;