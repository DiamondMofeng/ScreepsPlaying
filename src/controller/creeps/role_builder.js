import Repairer from './role_repairer';
import { getEnergyFromContainer, getEnergyFromStorage, getEnergyFromWasted, pickUpNearbyDroppedEnergy, getEnergyFromTerminal, getEnergyFromHarvest, prioritySelect } from '@/utils/util_beheavor';
import { stayInRoomCallBack } from '@/utils/costMatrix';



var roleBuilder = {

	/** @param {Creep} creep **/
	run: function (creep) {
		var targets
		const haveJob = () => {
			targets = creep.room.cts
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

				const priorties_cts = [STRUCTURE_STORAGE, STRUCTURE_TOWER, STRUCTURE_CONTAINER, STRUCTURE_LINK, STRUCTURE_EXTENSION,]
				let target = prioritySelect(creep.room.cts, priorties_cts, (ct) => ct.structureType)
				// console.log('target: ', target);

				if (target) {

					if (creep.build(target) == ERR_NOT_IN_RANGE) {
						creep.moveTo(target, { costCallback: stayInRoomCallBack, visualizePathStyle: { stroke: '#ffffff' } });
					}

				}
			}

			else {
				if (
					getEnergyFromStorage(creep)
					|| getEnergyFromTerminal(creep)
					|| getEnergyFromContainer(creep)
					|| pickUpNearbyDroppedEnergy(creep, 2)
					|| getEnergyFromWasted(creep, 2)
					|| getEnergyFromHarvest(creep)
				) { return }
			}
		}
		else {
			Repairer(creep)
		}
	}
};

export default roleBuilder.run;