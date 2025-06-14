/**
 * @module farmhand.items
 */

import { fieldMode, itemType } from '../enums.js'
import {
  COW_FEED_ITEM_ID,
  ADJUSTED_COW_FEED_ITEM_ID,
  HUGGING_MACHINE_ITEM_ID,
  INITIAL_SPRINKLER_RANGE,
  WATER_CREDIT_ID,
  MANURE_MANAGER_ID,
} from '../constants.js'

const { freeze } = Object
const {
  COW_FEED,
  ADJUSTED_COW_FEED,
  FERTILIZER,
  HUGGING_MACHINE,
  MILK,
  SCARECROW,
  SPRINKLER,
  WEED,
  WATER_CREDIT,
  MANURE_MANAGER,
} = itemType

export {
  asparagus,
  asparagusSeed,
  carrot,
  carrotSeed,
  corn,
  cornSeed,
  garlic,
  garlicSeed,
  // Green grapes
  grapeChardonnay,
  grapeSauvignonBlanc,
  // grapePinotBlanc,
  // grapeMuscat,
  // grapeRiesling,
  // End green grapes
  // Purple grapes
  // grapeMerlot,
  grapeCabernetSauvignon,
  // grapeSyrah,
  grapeTempranillo,
  grapeNebbiolo,
  // End purple grapes
  grapeSeed,
  jalapeno,
  jalapenoSeed,
  olive,
  oliveSeed,
  onion,
  onionSeed,
  pea,
  peaSeed,
  potato,
  potatoSeed,
  pumpkin,
  pumpkinSeed,
  soybean,
  soybeanSeed,
  spinach,
  spinachSeed,
  sunflower,
  sunflowerSeed,
  strawberry,
  strawberrySeed,
  sweetPotato,
  sweetPotatoSeed,
  tomato,
  tomatoSeed,
  watermelon,
  watermelonSeed,
  wheat,
  wheatSeed,
} from './crops/index.js'

export const weed = freeze({
  id: 'weed',
  name: 'Weed',
  value: 0.1,
  doesPriceFluctuate: false,
  type: WEED,
})

export {
  bronzeOre,
  coal,
  goldOre,
  ironOre,
  silverOre,
  stone,
  saltRock,
} from './ores/index.js'

////////////////////////////////////////
//
// FIELD TOOLS
//
////////////////////////////////////////

/**
 * @property farmhand.module:items.rainbowFertilizer
 * @type {farmhand.item}
 */
export const rainbowFertilizer = freeze({
  description:
    'Helps crops grow a little faster.',
  enablesFieldMode: fieldMode.FERTILIZE,
  id: 'rainbow-fertilizer',
  name: 'Rainbow Fertilizer',
  type: FERTILIZER,
  // Rainbow Fertilizer is worth less than regular Fertilizer because it is not
  // sold in the shop. Items that are sold in the shop have automatically
  // reduced resale value, but since that would not apply to Rainbow
  // Fertilizer, it is pre-reduced via this hardcoded value.
  value: 15,
})

/**
 * @property farmhand.module:items.sprinkler
 * @type {farmhand.item}
 */
export const sprinkler = freeze({
  description: 'Automatically waters adjacent plants every day.',
  enablesFieldMode: fieldMode.SET_SPRINKLER,
  // Note: The actual hoveredPlotRangeSize of sprinklers grows with the
  // player's level.
  hoveredPlotRangeSize: INITIAL_SPRINKLER_RANGE,
  id: 'sprinkler',
  isReplantable: true,
  name: 'Sprinkler',
  type: SPRINKLER,
  value: 120,
})

/**
 * @property farmhand.module:items.scarecrow
 * @type {farmhand.item}
 */
export const scarecrow = freeze({
  description:
    'Prevents crows from eating your crops. One scarecrow covers an entire field, but they are afraid of storms.',
  enablesFieldMode: fieldMode.SET_SCARECROW,
  // Note: This needs to be a safe number (rather than Infinity) because it
  // potentially gets JSON.stringify-ed during data export. Non-safe numbers
  // get stringify-ed to "null", which breaks reimporting.
  hoveredPlotRangeSize: Number.MAX_SAFE_INTEGER,
  id: 'scarecrow',
  isReplantable: true,
  name: 'Scarecrow',
  type: SCARECROW,
  value: 160,
})

/**
 * @property farmhand.module:items.watercredit
 * @type {farmhand.item}
 */
export const watercredit = freeze({
  id: WATER_CREDIT_ID,
  description:
    'Credit to compensate for waste water. Each cow consumes one unit of water credit per day (if you adopt sustainable farming practices, it will consume less).',
  enablesFieldMode: fieldMode.USE_WATER_CREDIT, // Define this in `enums.js` if needed
  name: 'Water Credit',
  type: WATER_CREDIT,
  value: 10,
})

/**
 * @property farmhand.module:items.manureManager
 * @type {farmhand.item}
 */
export const manureManager = freeze({
  id: MANURE_MANAGER_ID,
  description: 'A machine that sustainably processes manure waste. Purchasing a Manure Manager earns you one unit of water credit per cow every day.',
  enablesFieldMode: fieldMode.BUY_MANURE_MANAGER, // Define this in `enums.js` if needed
  name: 'Manure Manager',
  type: MANURE_MANAGER,
  value: 1000,
})
////////////////////////////////////////
//
// COW ITEMS
//
////////////////////////////////////////

/**
 * @property farmhand.module:items.cowFeed
 * @type {farmhand.item}
 */
export const cowFeed = freeze({
  id: COW_FEED_ITEM_ID,
  description:
    'Each cow automatically consumes one unit of Cow Feed per day. Fed cows gain and maintain weight.',
  name: 'Cow Feed',
  type: COW_FEED,
  value: 5,
})

/**
 * @property farmhand.module:items.adjustedcowFeed
 * @type {farmhand.item}
 */
export const adjustedcowFeed = freeze({
  id: ADJUSTED_COW_FEED_ITEM_ID,
  description:
    "Adjusted cow feed that reduces cows' nitrogen emmision. Each cow automatically consumes one unit of Adjusted Cow Feed per day. Using this feed will earn you one water credit per unit. Fed cows gain and maintain weight.",
  name: 'Adjusted Cow Feed',
  type: ADJUSTED_COW_FEED,
  value: 7,
})

/**
 * @property farmhand.module:items.huggingMachine
 * @type {farmhand.item}
 */
export const huggingMachine = freeze({
  id: HUGGING_MACHINE_ITEM_ID,
  description: 'Automatically hugs one cow three times every day.',
  name: 'Hugging Machine',
  type: HUGGING_MACHINE,
  value: 500,
})

/**
 * @property farmhand.module:items.milk1
 * @type {farmhand.item}
 */
export const milk1 = freeze({
  id: 'milk-1',
  name: 'Sustainability Grade C Milk',
  description: 'The sustainability grade of this milk aligns with your farm sustainability level on that day. The more sustainable your farm is, the better your received milk quality is.',
  type: MILK,
  value: 40,
})

/**
 * @property farmhand.module:items.milk2
 * @type {farmhand.item}
 */
export const milk2 = freeze({
  id: 'milk-2',
  name: 'Sustainability Grade B Milk',
  description: "The sustainability grade of this milk aligns with your farms sustainability level on that day. Although great, it's not the best quality there is.",
  type: MILK,
  value: 80,
})

/**
 * @property farmhand.module:items.milk3
 * @type {farmhand.item}
 */
export const milk3 = freeze({
  id: 'milk-3',
  name: 'Sustainability Grade A Milk',
  description: 'The sustainability grade of this milk aligns with your farms sustainability level on that day. Highest quality of milk you can receive!',
  type: MILK,
  value: 120,
})

/**
 * @property farmhand.module:items.rainbowMilk1
 * @type {farmhand.item}
 */
export const rainbowMilk1 = freeze({
  id: 'rainbow-milk-1',
  name: 'Sustainiability Grade C Rainbow Milk',
  description: 'The sustainability grade of this milk aligns with your farm sustainability level on that day. The more sustainable your farm is, the better your received milk quality is.',
  type: MILK,
  value: 60,
})

/**
 * @property farmhand.module:items.rainbowMilk2
 * @type {farmhand.item}
 */
export const rainbowMilk2 = freeze({
  id: 'rainbow-milk-2',
  name: 'Sustainability Grade B Rainbow Milk',
  description: "The sustainability grade of this milk aligns with your farms sustainability level on that day. Although great, it's not the best quality there is.",
  type: MILK,
  value: 120,
})

/**
 * @property farmhand.module:items.rainbowMilk3
 * @type {farmhand.item}
 */
export const rainbowMilk3 = freeze({
  id: 'rainbow-milk-3',
  name: 'Sustainability Grade A Rainbow Milk',
  description: 'The sustainability grade of this milk aligns with your farms sustainability level on that day. Highest quality of milk you can receive!',
  type: MILK,
  value: 180,
})

/**
 * @property farmhand.module:items.chocolateMilk
 * @type {farmhand.item}
 */
export const chocolateMilk = freeze({
  id: 'chocolate-milk',
  name: 'Sustainable Chocolate Milk. Contrary to the game, brown cows do not produce natural chocolate milk!',
  type: MILK,
  value: 80,
})
