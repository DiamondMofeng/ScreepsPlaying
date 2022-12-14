const Repairer = require('./role_repairer')
const { getEnergyFromContainer, getEnergyFromStorage, getEnergyFromWasted, pickUpNearbyDroppedEnergy, getEnergyFromTerminal, getEnergyFromHarvest } = require('./util_beheavor');
const { stayInRoomCallBack } = require('./util_costCallBacks');



var roleBuilder = {

	/** @param {Creep} creep **/
	run: function (creep, buildNewer = false) {
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
				let cts = _.groupBy(creep.room.cts, ct => ct.structureType);
				let targets = []
				const priorties_cts = [STRUCTURE_STORAGE, STRUCTURE_TOWER, STRUCTURE_CONTAINER, STRUCTURE_LINK, STRUCTURE_EXTENSION,]



				for (Ptype of priorties_cts) {

					if (targets.length > 0) {
						break;
					}

					for (type in cts) {
						if (Ptype == type) {
							targets = cts[type];
							break;
						}
					}
				}


				if (targets.length == 0) {
					targets = creep.room.cts
				}



				if (targets.length) {

					let target = buildNewer ? targets[targets.length - 1] : targets[0]

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

module.exports = roleBuilder.run;