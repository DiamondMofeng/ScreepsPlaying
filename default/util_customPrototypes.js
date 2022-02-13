
const customPrototypes = () => {

  if (_.isUndefined(Memory.flags)) {
    Memory.flags = {}
  }

  // Object.defineProperty(Memory, 'flags', {
  //   value: {},
  //   writable: true
  // })


  Object.defineProperty(Flag, 'memory', {
    value: Memory.flags[this.name],
    writable: true
  })
  // Flag.prototype.memory = Memory.flags[this.id]



}




module.exports = customPrototypes