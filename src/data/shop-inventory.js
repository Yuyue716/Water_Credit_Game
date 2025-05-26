/**
 * @typedef {import('../index').farmhand.item} farmhand.item
 */

import {
  watercredit,
  manureManager,
  adjustedcowFeed,
} from './items.js'

import { fertilizer } from './recipes.js'

/** @type {farmhand.item[]} */
const inventory = [
  watercredit,
  manureManager,
  fertilizer,
  adjustedcowFeed,
]

export default inventory

export const itemIds = new Set(inventory.map(item => item.id))
