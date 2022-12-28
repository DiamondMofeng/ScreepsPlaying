import assert from "power-assert"
import { LabMaterialConstant, RECIPES_LAB } from "./recipe"

const _REACTIONS = REACTIONS as Record<LabMaterialConstant, Record<LabMaterialConstant, MineralCompoundConstant>>

describe('RECIPRES_LAB', () => {

  it('shoule not be empty', () => {
    assert.notDeepEqual(RECIPES_LAB, {})
  })

  it('shoule be correct', () => {

    for (let material1 of Object.keys(_REACTIONS) as LabMaterialConstant[]) {
      for (let material2 of Object.keys(_REACTIONS[material1]) as LabMaterialConstant[]) {
        let result = _REACTIONS[material1][material2]!
        assert.deepEqual(RECIPES_LAB[result].sort(), [material1, material2].sort(), `${RECIPES_LAB[result]} should be [${material1}, ${material2}], but got ${RECIPES_LAB[result]}`)
      }
    }

  });
})