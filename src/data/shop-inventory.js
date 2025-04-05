/**
 * @typedef {import('../index').farmhand.item} farmhand.item
 */

import {
  // Plantable crops
  asparagusSeed,
  carrotSeed,
  cornSeed,
  grapeSeed,
  garlicSeed,
  jalapenoSeed,
  oliveSeed,
  onionSeed,
  peaSeed,
  potatoSeed,
  pumpkinSeed,
  soybeanSeed,
  spinachSeed,
  sunflowerSeed,
  strawberrySeed,
  sweetPotatoSeed,
  tomatoSeed,
  watermelonSeed,
  wheatSeed,

  // Field items
  scarecrow,
  sprinkler,
  watercredit,
  manureManager,
} from './items.js'

import { fertilizer } from './recipes.js'

/** @type {farmhand.item[]} */
const inventory = [
  // Plantable crops
  asparagusSeed,
  carrotSeed,
  cornSeed,
  grapeSeed,
  garlicSeed,
  jalapenoSeed,
  oliveSeed,
  onionSeed,
  peaSeed,
  potatoSeed,
  pumpkinSeed,
  soybeanSeed,
  spinachSeed,
  sunflowerSeed,
  strawberrySeed,
  sweetPotatoSeed,
  tomatoSeed,
  watermelonSeed,
  wheatSeed,

  // Field items
  fertilizer,
  scarecrow,
  sprinkler,
  watercredit,
  manureManager,
]

export default inventory

export const itemIds = new Set(inventory.map(item => item.id))
