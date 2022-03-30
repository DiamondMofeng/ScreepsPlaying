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




    const stats = {}


    // 统计 GCL / GPL 的升级百分比和等级
    stats.gcl = (Game.gcl.progress / Game.gcl.progressTotal) * 100
    stats.gclLevel = Game.gcl.level
    stats.gpl = (Game.gpl.progress / Game.gpl.progressTotal) * 100
    stats.gplLevel = Game.gpl.level
    // CPU 的当前使用量
    stats.cpu = Game.cpu.getUsed()
    // bucket 当前剩余量
    stats.bucket = Game.cpu.bucket

    // 预估GCL升级所需时间，以string显示
    if (Memory.stats && Memory.stats.gcl) {

        let diff = stats.gcl - Memory.stats.gcl //一个Frequency内的差值
        let remain = 100 - stats.gcl

        let requiredRealTime = (remain / (diff / FREQUENCY)) * SECOND_PER_TICK

        stats.gclTimeStr = secondToDateStr_DHMS(requiredRealTime)
        stats.gclTime = requiredRealTime

    }


    Memory.stats = stats;

    Memory.stats.rcl = {}
    Memory.stats.rclLevel = {}

    Memory.stats.store = {}
    for (let room of Object.values(Game.rooms)) {

        if (!room.controller.my) continue;

        Memory.stats.rcl[room.name] = {}
        Memory.stats.rclLevel[room.name] = {}

        Memory.stats.store[room.name] = {}

        //RCL进度统计
        // if (room.controller.level < 8) {
        Memory.stats.rclLevel[room.name] = room.controller.level
        Memory.stats.rcl[room.name] = (room.controller.progress / room.controller.progressTotal) * 100
        // }
        //store统计
        if (room.storage) {
            Memory.stats.store[room.name].storage = room.storage.store
        }
        if (room.terminal) {
            Memory.stats.store[room.name].terminal = room.terminal.store
        }

    }


}

module.exports = statsScanner;