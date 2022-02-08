const Upgrader = require('./role_upgrader')
const Repairer = require('./role_repairer')
const { getEnergyFromContainer, PriorizedTarget } = require('./util_beheavor')



var roleBuilder = {

	/** @param {Creep} creep **/
	run: function (creep) {
		var targets
		const haveJob = () => {
			targets = creep.room.find(FIND_CONSTRUCTION_SITES)
			if (targets.length) {
				return true
			}
			else return false
		}

		if (haveJob()) {


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
		else {
			Repairer(creep)
		}
	}
};

module.exports = roleBuilder.run;