// import attack_dismental from "./attack_dismental";
import claimNewRoom from "./scripts/script_claimNewRoom";
import developNewRoom from "./scripts/script_developRoom";
// import supportEnergy from "./script_supportEnergy";
import { cronRun, errorIsolater } from "@/utils/util_helper";


/**
 * 存放临时的命令
 */
const main_temp_commands = () => {


  //临时
  errorIsolater(() => {
    cronRun(2000, () => sellEnergy('W12N16'))

    claimNewRoom('develop_W21N14', 'W17N15_0')
    developNewRoom('develop_W21N14')

    // Game.market.createOrder(ORDER_SELL, 'O', 1.5, 300000, 'W11N8');

    // buildEnergyBase('W12N16_1', 'W12N17')
    // guardRoom('W12N17')
    // buildEnergyBase('W12N16_1', 'W11N16')
    // guardRoom('W11N16')
  });



  //support energy
  errorIsolater(() => {
    // let fromRoomList = ['W12N16', 'W11N8', 'W9N7', 'W17N15', 'W11N4']
    // let toRoomList = ['W24N32']
    // cronRun(1000, () => supportEnergy(fromRoomList, toRoomList))
  })


  //attack_dismental
  errorIsolater(() => {

    // attack_dismental()
  })


}
export default main_temp_commands;
