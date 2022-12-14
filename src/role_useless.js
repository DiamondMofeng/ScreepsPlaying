const { targetsPriorizer_byRef, recycleSelf, transferAllToStorage } = require('./util_beheavor')


var roleUseless = {

  /** @param {Creep} creep **/
  run: function (creep) {

    recycleSelf(creep,'Spawn1')
    
  }
}
module.exports = roleUseless.run;