const { recycleSelf } = require('./util_beheavor')

function attack_attackerCreep(creep) {
	let targets = creep.room.find(FIND_HOSTILE_CREEPS, {
		filter: HC => HC.body.indexOf(ATTACK) != -1
			|| HC.body.indexOf(RANGED_ATTACK != -1)
	})

	if (creep.attack(targets[0]) == ERR_NOT_IN_RANGE) {
		creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#DC143C', opacity: 0.9 } })
	}

}







/**
 * 
 * @param {Creep} creep 
 */
var roleGuardian = (creep) => {

	let CM = creep.memory
	let roomTG = Game.rooms[CM.guardian_Room]	//means roomToGuard
	// console.log('roomTG: ', roomTG);

	let flagName = 'Guard' + CM.guardian_Room

	if (roomTG.memory.inDanger == true) {

		let flag = Game.flags[flagName]

		// console.log('flag: ', flag);

		if (_.isUndefined(flag)) {
			roomTG.createFlag(25, 25, flagName, COLOR_YELLOW)
		}

		console.log(`Don't worry,Guardian of ${roomTG} is on the way! `)

		//! 待优化
		if (creep.room != flag.room) {
			creep.moveTo(flag)
		} else {
			attack_attackerCreep(creep)
		}

	} else {

		let flag = Game.flags[flagName]

		if (!_.isUndefined(flag)) {
			flag.remove()
		}

		recycleSelf(creep, CM.spawnName)
	}




};

module.exports = roleGuardian