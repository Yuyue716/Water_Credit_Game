import { fertilizerType } from '../../enums.js'
import { getInventoryQuantityMap } from '../../utils/getInventoryQuantityMap.js'
import { shouldStormToday } from '../../utils/index.js'

import {
  fieldHasScarecrow,
  plotContainsScarecrow,
  updateField,
} from './helpers.js'
import { decrementItemFromInventory } from './decrementItemFromInventory.js'
import { waterField } from './waterField.js'

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const applyPrecipitation = state => {
  let { field } = state
  let scarecrowsConsumedByReplanting = 0

  if (shouldStormToday() && fieldHasScarecrow(field)) {
    let { scarecrow: scarecrowsInInventory = 0 } = getInventoryQuantityMap(
      state.inventory
    )

    field = updateField(field, plot => {
      if (!plotContainsScarecrow(plot)) {
        return plot
      }

      if (
        scarecrowsInInventory &&
        plot.fertilizerType === fertilizerType.RAINBOW
      ) {
        scarecrowsInInventory--
        scarecrowsConsumedByReplanting++

        return plot
      }

      return null
    })
  }

  state = decrementItemFromInventory(
    { ...state, field },
    'scarecrow',
    scarecrowsConsumedByReplanting
  )

  state = waterField(state)

  return state
}