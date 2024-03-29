import Repairer from './role_repairer';
import { getEnergyFromContainer, getEnergyFromStorage, getEnergyFromWasted, pickUpNearbyDroppedEnergy } from '@/utils/util_beheavor';



var roleBuilder = {

	/** @param {Creep} creep **/
	run: function (creep, buildNewer = true) {
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

					let target = buildNewer ? targets[targets.length - 1] : targets[0]

					if (creep.build(target) == ERR_NOT_IN_RANGE) {
						creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
					}
				}
			}
			else {
				if (
					getEnergyFromStorage(creep)
					|| getEnergyFromContainer(creep)
					|| pickUpNearbyDroppedEnergy(creep, 2)
					|| getEnergyFromWasted(creep, 2)
				) { return }
				//dig
				var sources = creep.room.find(FIND_SOURCES_ACTIVE);

				if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
					creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
				}
			}
		}
		else {
			Repairer(creep)
		}
	}
};

export default roleBuilder.run;