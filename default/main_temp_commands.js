const attack_dismental = require("./attack_dismental");
const supportEnergy = require("./script_supportEnergy");
const { cronRun, errorIsolater, getRemainingRenewTime } = require("./util_helper");


/**
 * 存放临时的命令
 */
const main_temp_commands = () => {


  //临时
  errorIsolater(() => {
    // console.log(JSON.stringify(
    //   // getRemainingRenewTime(Game.getObjectById('62a5f9a461680030e0670faf'))
    // ))
    // getCPUCost(roomPlanner, 'W17N15')



    // claimNewRoom('expand3', 'W17N15_0', 'W15N15')

    // Game.market.createOrder(ORDER_SELL, 'O', 1.5, 300000, 'W11N8');


    // buildEnergyBase('W12N16_1', 'W12N17')
    // guardRoom('W12N17')
    // buildEnergyBase('W12N16_1', 'W11N16')
    // guardRoom('W11N16')
  });



  //support energy
  errorIsolater(() => {
    let fromRoomList = ['W12N16', 'W11N8', 'W9N7', 'W17N15']
    let toRoomList = ['W11N4', 'E44S59']
    cronRun(1000, () => supportEnergy(fromRoomList, toRoomList))
  })


  //attack_dismental
  errorIsolater(() => {

    // attack_dismental()
  })


}
module.exports = main_temp_commands;
