


/*

依赖： Rmemory



*/
const RM_TYPE = 'type'


const LAB_TYPE_BOOST = 'boost'
const LAB_TYPE_REACTION = 'reaction'    // 反应实验室，存放反应产物 / 分解原料
const LAB_TYPE_RAW = 'raw'              // 提供反应原料 / 存放分解产物 ,        一般有2个




/**
 * 
 * @param {Room} room 
 */
function defineTypeOfLabs(room, typeBoostNumber = 1) {

  const typeRawNumber = 2

  let labs = room.find(FIND_MY_STRUCTURES, {
    filter: s => s.structureType == STRUCTURE_LAB
  })
  //清除已有的类型
  for (let lab of labs) {
    lab.Rmemory[RM_TYPE] = undefined
  }


  //确定lab的类型：
  //* 确定raw类型：
  //找出与其他lab距离均小于等于REACTION_RANGE的Lab
  let REACTION_RANGE = 2;

  let count_raw = 0;
  let count_boost = 0;
  for (let lab1 of labs) {

    // 终止条件
    if (lab1.Rmemory[RM_TYPE] != undefined) {
      continue;
    }
    if (count_raw >= typeRawNumber) {
      continue;
    }

    //
    let canBeRaw = true;

    for (let lab2 of labs) {
      if (lab1 === lab2) {
        continue
      }
      if (lab1.pos.getRangeTo(lab2) > REACTION_RANGE) {
        canBeRaw = false
        break
      }
    }

    if (canBeRaw === true) {
      lab1.Rmemory[RM_TYPE] = LAB_TYPE_RAW
      count_raw += 1;
      continue
    }

  }

  //* 确定boost类型：
  //找出与terminal??storage最近的lab
  let auxToLocate =
    room.terminal ? room.terminal :
      room.storage ? room.storage :
        undefined

  if (auxToLocate != undefined) {
    labs.sort((a, b) => a.pos.getRangeTo(auxToLocate) - b.pos.getRangeTo(auxToLocate))
    for (let i = 0; i < typeBoostNumber; i++) {
      labs[i].Rmemory[RM_TYPE] = LAB_TYPE_BOOST
    }
  }

  //* 确定reaction类型：
  //剩下的全是reaction
  labs = labs.filter(lab => lab.Rmemory.type == undefined)
  for (let lab of labs) {
    lab.Rmemory[RM_TYPE] = LAB_TYPE_REACTION
  }



}


/**
 * 
 * @param {StructureLab} lab 
 */
const Lab = (lab) => {

  if (!lab.Rmemory[RM_TYPE]) {
    defineTypeOfLabs(lab.room)
  }



}


module.exports = Lab