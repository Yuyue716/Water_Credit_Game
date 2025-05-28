/** @typedef {import('../index.js').farmhand.achievement} farmhand.achievement */
import { addItemToInventory } from '../game-logic/reducers/index.js'
import {
  doesPlotContainCrop,
  dollarString,
  getCropLifeStage,
  getProfitRecord,
  integerString,
  isOctober,
  moneyTotal,
  percentageString,
} from '../utils/index.js'
import { memoize } from '../utils/memoize.js'
import { findInField } from '../utils/findInField.js'
import { addExperience } from '../game-logic/reducers/index.js'
import { cropLifeStage, standardCowColors } from '../enums.js'
import {
  COW_FEED_ITEM_ID,
  EXPERIENCE_VALUES,
  I_AM_RICH_BONUSES,
} from '../constants.js'
import { getSustainabilityLevelFromMilk } from '../utils/index.js'

import { itemsMap } from './maps.js'

const { SEED } = cropLifeStage

const addMoney = (state, reward) => ({
  ...state,
  money: moneyTotal(state.money, reward),
})

const sumOfCropsHarvested = memoize(cropsHarvested =>
  Object.values(cropsHarvested).reduce(
    (sum, cropHarvested) => sum + cropHarvested,
    0
  )
)

const cowFeed = itemsMap[COW_FEED_ITEM_ID]

/**
 * @type {farmhand.achievement[]}
 */
const achievements = [
  ((reward = 50) => ({
    id: 'purchase-female-cow',
    name: 'Purchase a Female Cow',
    description:
      'Buy at least one female cow. (If the cow available is not female, advance to the next day to see different offers.)',
    rewardDescription: dollarString(reward),
    condition: state =>
      Array.isArray(state.cowInventory) &&
      state.cowInventory.some(cow => cow.gender === 'FEMALE'),
    reward: state => addMoney(state, reward),
  }))(),

  ((goal = 5, reward = 50) => ({
    id: 'purchase-water-credits',
    name: 'Introduction to Water Credits',
    description: `Purchase ${goal} Water Credits.`,
    rewardDescription: dollarString(reward),
    condition: state => {
      const inventory = state.inventory ?? []
      const waterCreditInventoryPosition = inventory.findIndex(
        ({ id }) => id === itemsMap['water-credit'].id
      )
      const waterCredit = inventory[waterCreditInventoryPosition]
      const waterQuantity = waterCredit ? waterCredit.quantity : 0

      return waterQuantity >= goal
    },
    reward: state => addMoney(state, reward),
  }))(),

  ((goal = 5, reward = 100) => ({
    id: 'feed-cows',
    name: 'Feed your cows',
    description: `Purchase at least ${goal} units of Cow Feed or Adjusted Cow Feed.`,
    rewardDescription: dollarString(reward),
    condition: state => {
      const inventory = state.inventory ?? []
      const cowFeed = inventory.find(
        item => item.id === itemsMap['cow-feed'].id
      )
      const adjustedCowFeed = inventory.find(
        item => item.id === itemsMap['adjusted-cow-feed'].id
      )

      const totalFeedPurchased =
        (cowFeed?.quantity ?? 0) + (adjustedCowFeed?.quantity ?? 0)

      return totalFeedPurchased >= goal
    },
    reward: state => addMoney(state, reward),
  }))(),

  ((goal = 1, reward = 50) => ({
    id: 'milk-sold',
    name: 'Milk Sold',
    description: `Sell at least ${integerString(
      goal
    )} unit of any type of milk.`,
    rewardDescription: dollarString(reward),
    condition: state =>
      (state.itemsSold?.[itemsMap['milk-1'].id] ?? 0) +
        (state.itemsSold?.[itemsMap['milk-2'].id] ?? 0) +
        (state.itemsSold?.[itemsMap['milk-3'].id] ?? 0) >=
      goal,
    reward: state => addMoney(state, reward),
  }))(),

  ((reward = 800) => ({
    id: 'sustainability-level-b',
    name: 'Sustainable-ish',
    description:
      'Achieve a sustainability level of B in your dairy practices (try adapting more sustainable farming practices!)',
    rewardDescription: dollarString(reward),
    condition: state => {
      const inventory = state.inventory ?? []

      const manureManagerCount =
        inventory.find(item => item.id === 'manure-manager')?.quantity ?? 0
      const adjustedCowFeed =
        inventory.find(item => item.id === 'adjusted-cow-feed')?.quantity ?? 0
      const cowCount = state.cowCount ?? 1

      const sustainabilityLevel = getSustainabilityLevelFromMilk({
        manureManagerCount,
        adjustedCowFeed,
        cowCount,
      })
      return sustainabilityLevel === 'B'
    },
    reward: state => addMoney(state, reward),
  }))(),

  ((goal = 1, reward = 50) => ({
    id: 'milk-sold-two',
    name: 'Milk Sold 2',
    description: `Sell at least ${integerString(
      goal
    )} unit of B or higher type of milk.`,
    rewardDescription: dollarString(reward),
    condition: state =>
      (state.itemsSold?.[itemsMap['milk-2'].id] ?? 0) +
        (state.itemsSold?.[itemsMap['milk-3'].id] ?? 0) >=
      goal,
    reward: state => addMoney(state, reward),
  }))(),

  ((reward = 50) => ({
    id: 'sustainability-level-a',
    name: 'Sustainable',
    description:
      'Achieve a sustainability level of A in your dairy practices (try adapting more sustainable farming practices!)',
    rewardDescription: dollarString(reward),
    condition: state => {
      const inventory = state.inventory ?? []

      const manureManagerCount =
        inventory.find(item => item.id === 'manure-manager')?.quantity ?? 0
      const adjustedCowFeed =
        inventory.find(item => item.id === 'adjusted-cow-feed')?.quantity ?? 0
      const cowCount = state.cowCount ?? 1

      const sustainabilityLevel = getSustainabilityLevelFromMilk({
        manureManagerCount,
        adjustedCowFeed,
        cowCount,
      })
      return sustainabilityLevel === 'A'
    },
    reward: state => addMoney(state, reward),
  }))(),

  ((goal = 1, reward = 100000) => ({
    id: 'milk-sold-fin',
    name: 'Milk Sold 3',
    description: `Sell at least ${integerString(goal)} unit of A type of milk.`,
    rewardDescription: dollarString(reward),
    condition: state => (state.itemsSold?.[itemsMap['milk-3'].id] ?? 0) >= goal,
    reward: state => addMoney(state, reward),
  }))(),

  ((goal = 1, reward = 9999999) => ({
    id: 'finit',
    name: 'Congratulations!',
    description: 'FREE MODE!',
    rewardDescription: `${reward} units of infinite glory`,
    condition: () => false, // Never achievable
    reward: state => state,
  }))(),
]

export default achievements

export const achievementsMap = {}
