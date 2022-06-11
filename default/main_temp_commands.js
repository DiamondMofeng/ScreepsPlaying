const attack_dismental = require("./attack_dismental");
const supportEnergy = require("./script_supportEnergy");
const { cronRun, errorIsolater } = require("./util_helper");


/**
 * 存放临时的命令
 */
const main_temp_commands = () => {


  //临时
  errorIsolater(() => {

    // getCPUCost(roomPlanner, 'W17N15')



    // claimNewRoom('expand3', 'W17N15_0', 'W15N15')




    // buildEnergyBase('W12N16_1', 'W12N17')
    // guardRoom('W12N17')
    // buildEnergyBase('W12N16_1', 'W11N16')
    // guardRoom('W11N16')
  });



  //support energy
  errorIsolater(() => {
    let fromRoomList = ['W12N16', 'E28N3', 'W11N8', 'W9N7', 'W17N15']
    let toRoomList = ['W11N4', 'E44S59']
    cronRun(() => supportEnergy(fromRoomList, toRoomList), 1000)
  })


  //attack_dismental
  errorIsolater(() => {

    // attack_dismental()
  })


}
module.exports = main_temp_commands;
