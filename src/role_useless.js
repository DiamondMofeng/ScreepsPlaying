import { recycleSelf } from './util_beheavor';


var roleUseless = {

  /** @param {Creep} creep **/
  run: function (creep) {

    recycleSelf(creep, 'Spawn1')

  }
}
export default roleUseless.run;