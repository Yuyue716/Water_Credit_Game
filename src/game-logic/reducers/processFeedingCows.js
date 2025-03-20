import { clampNumber } from '../../utils/index.js'
import {
  COW_FEED_ITEM_ID,
  ADJUSTED_COW_FEED_ITEM_ID,
  WATER_CREDIT_ID,
  COW_WEIGHT_MULTIPLIER_FEED_BENEFIT,
  COW_WEIGHT_MULTIPLIER_MAXIMUM,
  COW_WEIGHT_MULTIPLIER_MINIMUM,
} from '../../constants.js'
import { OUT_OF_COW_FEED_NOTIFICATION,OUT_OF_WATER_CREDIT_NOTIFICATION } from '../../strings.js'

import { decrementItemFromInventory } from './decrementItemFromInventory.js'

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const processFeedingCows = state => {
  const cowInventory = [...state.cowInventory]
  const { length: cowInventoryLength } = cowInventory
  const newDayNotifications = [...state.newDayNotifications]
  const inventory = [...state.inventory]

  const cowFeedInventoryPosition = inventory.findIndex(
    ({ id }) => id === COW_FEED_ITEM_ID
  )

  const cowFeed = inventory[cowFeedInventoryPosition]
  const cowFeedQuantity = cowFeed ? cowFeed.quantity : 0

  const adjustedCowFeedInventoryPosition = inventory.findIndex(
    ({ id }) => id === ADJUSTED_COW_FEED_ITEM_ID
  )
  const adjustedCowFeed = inventory[adjustedCowFeedInventoryPosition]
  const adjustedFeedQuantity = adjustedCowFeed ? adjustedCowFeed.quantity : 0


   // Find Water Credit in Inventory
  const waterCreditInventoryPosition = inventory.findIndex(
    ({ id }) => id === WATER_CREDIT_ID
  )
  const waterCredit = inventory[waterCreditInventoryPosition]
  const waterCreditQuantity = waterCredit ? waterCredit.quantity : 0

  let adjustedUnitsSpent = 0
  let cowFeedUnitsSpent = 0
  let waterUnitsSpent = 0
  let waterCreditsEarned = 0

  for (let i = 0; i < cowInventoryLength; i++) {
    const cow = cowInventory[i]
    const hasAdjustedFeed = adjustedUnitsSpent < adjustedFeedQuantity
    const hasCowFeed = cowFeedUnitsSpent < cowFeedQuantity
    const hasWater = waterUnitsSpent < waterCreditQuantity

    if (hasAdjustedFeed) {
      // Cow consumes ADJUSTED_COW_FEED (instead of COW_FEED)
      adjustedUnitsSpent++
      waterCreditsEarned++ // Gain 1 water credit per adjusted feed consumed
    } else if (hasCowFeed) {
      // Only if no ADJUSTED_COW_FEED, consume normal COW_FEED
      cowFeedUnitsSpent++
    }

    if (hasWater) {
      waterUnitsSpent++
    }

    // Update cow's weight multiplier
    cowInventory[i] = {
      ...cow,
      weightMultiplier: clampNumber(
        hasAdjustedFeed || hasCowFeed
          ? cow.weightMultiplier + COW_WEIGHT_MULTIPLIER_FEED_BENEFIT
          : cow.weightMultiplier - COW_WEIGHT_MULTIPLIER_FEED_BENEFIT,
        COW_WEIGHT_MULTIPLIER_MINIMUM,
        COW_WEIGHT_MULTIPLIER_MAXIMUM
      ),
    }
  }

  if (cowFeedQuantity <= cowInventoryLength && cowInventoryLength > 0) {
    newDayNotifications.push({
      message: OUT_OF_COW_FEED_NOTIFICATION,
      severity: 'error',
    })
  }
  if (waterCreditQuantity <= cowInventoryLength && cowInventoryLength > 0) {
    newDayNotifications.push({
      message: OUT_OF_WATER_CREDIT_NOTIFICATION,
      severity: 'error',
    })
  }
  return decrementItemFromInventory(
    decrementItemFromInventory(
      decrementItemFromInventory(
        { ...state, cowInventory, inventory, newDayNotifications },
        COW_FEED_ITEM_ID,
        cowFeedUnitsSpent
        ),
    WATER_CREDIT_ID,
    waterUnitsSpent - waterCreditsEarned
    ),
    ADJUSTED_COW_FEED_ITEM_ID,
    adjustedUnitsSpent
);

}
