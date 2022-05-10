function secondToDateStr_HMS(sec) {

    let h = Math.floor(sec / 3600) < 10 ? '0' + Math.floor(sec / 3600) : Math.floor(sec / 3600);
    let m = Math.floor((sec / 60 % 60)) < 10 ? '0' + Math.floor((sec / 60 % 60)) : Math.floor((sec / 60 % 60));
    let s = Math.floor((sec % 60)) < 10 ? '0' + Math.floor((sec % 60)) : Math.floor((sec % 60));

    let res = '';
    if (h !== '00') res += `${h}h`;
    if (m !== '00') res += `${m}min`;
    res += `${s}s`;
    return res;
}

function secondToDateStr_DHMS(sec) {

    let d = Math.floor(sec / 24 / 3600) < 10 ? '0' + Math.floor(sec / 3600 / 24) : Math.floor(sec / 3600 / 24);
    let h = Math.floor(sec / 3600 % 24) < 10 ? '0' + Math.floor(sec / 3600 % 24) : Math.floor(sec / 3600 % 24);
    let m = Math.floor((sec / 60 % 60)) < 10 ? '0' + Math.floor((sec / 60 % 60)) : Math.floor((sec / 60 % 60));
    let s = Math.floor((sec % 60)) < 10 ? '0' + Math.floor((sec % 60)) : Math.floor((sec % 60));

    let res = '';
    if (d !== '00') res += `${d}d`;
    if (h !== '00') res += `${h}h`;
    if (m !== '00') res += `${m}min`;
    res += `${s}s`;
    return res;
}




//MAIN
/**
 * 全局统计信息扫描器
 * 负责搜集关于 cpu、memory、GCL、GPL 的相关信息
 */
const statsScanner = function () {

    const FREQUENCY = 20
    const SECOND_PER_TICK = 3

    // 每 20 tick 运行一次
    if (Game.time % FREQUENCY) return


    /**
    * 计算两次差值得到剩余时间
    * @param {Number} cur 
    * @param {Number} last 
    * @param {Object} objToOutput 
    * @param {String} outputName
    */
    function calcTimeToLevelUp(cur, last, objToOutput, outputName, isOutputStr = false) {
        let diff = cur - last //一个Frequency内的差值
        let remain = 100 - cur

        let requiredRealTime = Math.floor((remain / (diff / FREQUENCY)) * SECOND_PER_TICK)

        objToOutput[outputName] = requiredRealTime

        if (isOutputStr) {
            objToOutput[outputName + 'Str'] = secondToDateStr_DHMS(requiredRealTime)
        }
    }



    const stats = {}


    // 统计 GCL / GPL 的升级百分比和等级
    stats.gcl = (Game.gcl.progress / Game.gcl.progressTotal) * 100
    stats.gclLevel = Game.gcl.level
    stats.gpl = (Game.gpl.progress / Game.gpl.progressTotal) * 100
    stats.gplLevel = Game.gpl.level


    // 预估*GCL*升级所需时间，以string显示
    if (Memory.stats && Memory.stats.gcl) {

        calcTimeToLevelUp(stats.gcl, Memory.stats.gcl, stats, 'gclTime')

    }

    // 预估*GPL*升级所需时间，以string显示
    if (Memory.stats && Memory.stats.gcl) {

        calcTimeToLevelUp(stats.gpl, Memory.stats.gpl, stats, 'gplTime')

    }


    //* Room部分

    stats.rcl = {}
    stats.rclLevel = {}
    stats.rclTime = {}
    stats.store = {}

    for (let room of Object.values(Game.rooms)) {

        if (!room.controller || !room.controller.my) continue;

        stats.rcl[room.name] = {}
        stats.rclLevel[room.name] = {}

        stats.store[room.name] = {}

        //RCL进度统计
        stats.rclLevel[room.name] = room.controller.level
        stats.rcl[room.name] = (room.controller.progress / room.controller.progressTotal) * 100

        //获取剩余升级时间

        if (Memory.stats && Memory.stats.rcl && Memory.stats.rcl[room.name]) {
            calcTimeToLevelUp(stats.rcl[room.name], Memory.stats.rcl[room.name], stats.rclTime, room.name)
        }

        //store统计
        if (room.storage) {
            stats.store[room.name].storage = room.storage.store
        }
        if (room.terminal) {
            stats.store[room.name].terminal = room.terminal.store
        }

    }


    //* 统计各房间的能量信息
    stats.energy = {}
    for (let room of Object.values(Game.rooms)) {
        if (!room.controller || !room.controller.my) continue;

        stats.energy[room.name] = {}

        //统计房间的能量信息
        if (room.storage) {
            stats.energy[room.name] = room.storage.store[RESOURCE_ENERGY] || 0
        }
        if (room.terminal) {
            stats.energy[room.name] += room.terminal.store[RESOURCE_ENERGY] || 0
        }
    }

    stats.credits = Game.market.credits

    //放在最后
    // CPU 的当前使用量
    stats.cpu = Game.cpu.getUsed()
    // bucket 当前剩余量
    stats.bucket = Game.cpu.bucket

    Memory.stats = stats;

    // Memory.stats.rcl = {}
    // Memory.stats.rclLevel = {}

    // Memory.stats.store = {}
    // for (let room of Object.values(Game.rooms)) {

    //     if (!room.controller || !room.controller.my) continue;

    //     Memory.stats.rcl[room.name] = {}
    //     Memory.stats.rclLevel[room.name] = {}

    //     Memory.stats.store[room.name] = {}

    //     //RCL进度统计
    //     Memory.stats.rclLevel[room.name] = room.controller.level
    //     Memory.stats.rcl[room.name] = (room.controller.progress / room.controller.progressTotal) * 100

    //     //获取剩余升级时间

    //     //store统计
    //     if (room.storage) {
    //         Memory.stats.store[room.name].storage = room.storage.store
    //     }
    //     if (room.terminal) {
    //         Memory.stats.store[room.name].terminal = room.terminal.store
    //     }

    // }


}

module.exports = statsScanner;