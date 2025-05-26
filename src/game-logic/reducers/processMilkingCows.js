import {
  doesInventorySpaceRemain,
  getCowMilkItem,
  getCowMilkRate,
} from '../../utils/index.js'
import {
  countManureManagers,
  getAdjustedCowFeedQuantity
} from '../../utils/InventoryHelpers'
import { MILKS_PRODUCED } from '../../templates.js'

import { addItemToInventory } from './addItemToInventory.js'

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const processMilkingCows = state => {
  const cowInventory = [...state.cowInventory]
  const newDayNotifications = [...state.newDayNotifications]
  const { length: cowInventoryLength } = cowInventory
  const milksProduced = {}
  console.log('Player inventory inside processMilkingCows:', state.playerInventory)
  const manureManagerCount = countManureManagers(state.inventory)
  const adjustedCowFeed = getAdjustedCowFeedQuantity(state.inventory)
  const cowCount = state.cowInventory.length
  console.log('manureManagerCount:', manureManagerCount)
  console.log('adjustedCowFeed:', adjustedCowFeed)
  console.log('cowCount:', cowCount)
  for (let i = 0; i < cowInventoryLength; i++) {
    const cow = cowInventory[i]

    if (cow.daysSinceMilking > getCowMilkRate(cow)) {
      cowInventory[i] = { ...cow, daysSinceMilking: 0 }

      const milk = getCowMilkItem(cow, {
        manureManagerCount,
        adjustedCowFeed,
        cowCount,
      })

      const { name } = milk

      if (!doesInventorySpaceRemain(state)) {
        break
      }

      milksProduced[name] = (milksProduced[name] || 0) + 1
      state = addItemToInventory(state, milk)
    }
  }

  if (Object.keys(milksProduced).length) {
    newDayNotifications.push({
      message: MILKS_PRODUCED`${milksProduced}`,
      severity: 'success',
    })
  }

  return { ...state, cowInventory, newDayNotifications }
}

