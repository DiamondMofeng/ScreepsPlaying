import { recycleSelf, moveToRoom } from './util_beheavor'


/**
 * 
 * @param {Creep} creep 
 */
function attack_attackerCreep(creep) {
	let targets = creep.room.find(FIND_HOSTILE_CREEPS,
		{
			filter: HC => HC.body.indexOf(ATTACK) != -1
				|| HC.body.indexOf(RANGED_ATTACK != -1)
		}
	)
	let target = creep.pos.findClosestByPath(targets)

	let attackRes = creep.attack(target)
	// if () {
	creep.moveTo(target, { visualizePathStyle: { stroke: '#DC143C', opacity: 0.9 } })
	// } else {
	// 	//* 防止放风筝
	// 	fleePathFinder = PathFinder.search(target.pos, creep.pos, { flee: true })
	// 	console.log(JSON.stringify(fleePathFinder))
	// 	creep.moveTo(fleePathFinder.path[0])
	// }


}







/**
 * 
 * @param {Creep} creep 
 */
var roleGuardian = (creep) => {


	// function isBattleable(creep) {
	// 	for (part of creep.body) {
	// 		if (part.type == ATTACK || part.type == RANGED_ATTACK) {
	// 			return true
	// 		}
	// 	}
	// 	return false
	// }
	// console.log('isBattleable(creep): ', isBattleable(creep));

	let CM = creep.memory
	let roomTG = Game.rooms[CM.guardian_Room]	//means roomToGuard
	// console.log('roomTG: ', roomTG);



	// console.log('debug')
	if (Memory.rooms[CM.guardian_Room].inDanger == true) {

		let flag = Game.flags[CM.guardian_FlagName]

		// console.log('flag: ', flag);

		// if (_.isUndefined(flag)) {
		// 	let flagPos = new RoomPosition(25, 25, CM.guardian_Room)
		// 	flagPos.createFlag(flagName, COLOR_YELLOW)
		// 	// roomTG.createFlag(25, 25, )
		// }

		console.log(`Don't worry,Guardian of ${CM.guardian_Room} is on the way! `)

		//! 待优化
		// if (creep.room != flag.room || _.isUndefined(flag.room)) {
		// 	creep.moveTo(flag)
		// 	console.log('creep.moveTo(flag): ', creep.moveTo(flag));
		// } else {
		// }
		moveToRoom(creep, CM.guardian_Room, true)
		attack_attackerCreep(creep)

	} else {

		let flag = Game.flags[CM.guardian_FlagName]

		if (!_.isUndefined(flag)) {
			flag.remove()
		}

		recycleSelf(creep, CM.spawnName)
	}




};

export default roleGuardian