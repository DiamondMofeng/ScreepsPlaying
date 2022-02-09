const { targetsPriorizer_byRef, recycleSelf, transferAllToStorage } = require('./util_beheavor')


var roleUseless = {

  /** @param {Creep} creep **/
  run: function (creep) {

    recycleSelf(creep)
    
  }
}
module.exports = roleUseless.run;