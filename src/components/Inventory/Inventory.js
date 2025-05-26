import React, { Fragment, useState } from 'react'
import Accordion from '@mui/material/Accordion/index.js'
import AccordionSummary from '@mui/material/AccordionSummary/index.js'
import AccordionDetails from '@mui/material/AccordionDetails/index.js'
import Checkbox from '@mui/material/Checkbox/index.js'
import FormControlLabel from '@mui/material/FormControlLabel/index.js'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore.js'
import { array } from 'prop-types'
import {
  countManureManagers,
  getAdjustedCowFeedQuantity
} from '../../utils/InventoryHelpers.js';
import { MANURE_MANAGER_ID, ADJUSTED_COW_FEED_ITEM_ID } from '../../constants.js'
import FarmhandContext from '../Farmhand/Farmhand.context.js'
import Item from '../Item/index.js'
import { itemsMap } from '../../data/maps.js'
import { sortItems } from '../../utils/index.js'
import SearchBar from '../SearchBar/index.js'
import './Inventory.sass'



// Using Map for categories to preserve key order and enable Map methods
export const categoryIds = new Map([
  ['ANIMAL_PRODUCTS', 'ANIMAL_PRODUCTS'],
  ['ANIMAL_SUPPLIES', 'ANIMAL_SUPPLIES'],
  ['FIELD_TOOLS', 'FIELD_TOOLS'],
  ['CRAFTED_ITEMS', 'CRAFTED_ITEMS'],
  ['WATER_CREDIT', 'WATER_CREDIT'],
  ['MANURE_MANAGER', 'MANURE_MANAGER'],
])

const itemTypeCategoryMap = new Map([
  ['COW_FEED', 'ANIMAL_SUPPLIES'],
  ['ADJUSTED_COW_FEED', 'ANIMAL_SUPPLIES'],
  ['CRAFTED_ITEM', 'CRAFTED_ITEMS'],
  ['FERTILIZER', 'FIELD_TOOLS'],
  ['FUEL', 'MINED_RESOURCES'],
  ['HUGGING_MACHINE', 'ANIMAL_SUPPLIES'],
  ['MILK', 'ANIMAL_PRODUCTS'],
  ['ORE', 'MINED_RESOURCES'],
  ['SPRINKLER', 'FIELD_TOOLS'],
  ['STONE', 'MINED_RESOURCES'],
  ['WEED', 'FORAGED_ITEMS'],
  ['WATER_CREDIT', 'WATER_CREDIT'],
  ['MANURE_MANAGER', 'MANURE_MANAGER'],
])


// Initialize Map to group items into categories
const getItemCategories = () =>
  new Map(Array.from(categoryIds.keys()).map(key => [key, []]))

export const separateItemsIntoCategories = items =>
  sortItems(items).reduce((categories, item) => {
    const { type } = itemsMap[item.id]
    const category = itemTypeCategoryMap.get(type)

    if (category === 'CROPS') {
      const targetCategory = item.isPlantableCrop ? 'SEEDS' : 'CROPS'
      categories.get(targetCategory)?.push(item)
    } else if (categories.has(category)) {
      categories.get(category)?.push(item)
    }

    return categories
  }, getItemCategories())

const formatCategoryName = key =>
  key
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase())

const Inventory = ({
  items,
  playerInventory,
  shopInventory,
  isPurchaseView = false,
  isSellView = false,
  itemCategories = separateItemsIntoCategories(items),
  placeholder = 'Search inventory...',
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])
  const toggleCategory = category => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    
    )
  }
const manureManagerCount = playerInventory.filter(({ id }) => id === 'manure-manager').length;
const adjustedCowFeedItem = playerInventory.find(({ id }) => id === 'adjusted-cow-feed');
const adjustedCowFeed = adjustedCowFeedItem ? adjustedCowFeedItem.quantity : 0;

console.log('All items:', items.map(i => i.id));
console.log('Categories:', [...itemCategories.entries()]);
console.log('itemsMap["adjusted-cow-feed"]:', itemsMap['adjusted-cow-feed']);


  const filteredCategories = Array.from(itemCategories.entries()).reduce(
    (filtered, [category, items]) => {
      const matchingItems = items.filter(item =>
        itemsMap[item.id]?.name
          ?.toLowerCase()
          ?.includes(searchQuery.toLowerCase())
      )

      if (
        matchingItems.length &&
        (!selectedCategories.length || selectedCategories.includes(category))
      ) {
        filtered.set(category, matchingItems)
      }
      return filtered
    },
    new Map()
  )

  return (
    <div className="Inventory">
      <SearchBar placeholder={placeholder} onSearch={setSearchQuery} />
      {!isPurchaseView && (
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="filter-content"
            id="filter-header"
          >
            <h4>Filter by category</h4>
          </AccordionSummary>
          <AccordionDetails>
            <div className="filter-section">
              {Array.from(categoryIds.keys()).map(key => (
                <FormControlLabel
                  key={key}
                  sx={{
                    display: 'block',
                  }}
                  control={
                    <Checkbox
                      disabled={isPurchaseView}
                      checked={selectedCategories.includes(key)}
                      onChange={() => toggleCategory(key)}
                    />
                  }
                  label={formatCategoryName(key)}
                />
              ))}
            </div>
          </AccordionDetails>
        </Accordion>
      )}
      {Array.from(filteredCategories.entries()).map(([category, items]) =>
        items.length ? (
          <Fragment key={category}>
            <section>
              <h3>{formatCategoryName(category)}</h3>
              <ul className="card-list">
                {items.map(item => (
                  <li key={item.id}>
                    <Item
                      {...{
                        isPurchaseView,
                        isSellView,
                        item,
                        showQuantity: isPurchaseView,
                      }}
                    />
                  </li>
                ))}
              </ul>
            </section>
          </Fragment>
        ) : null
      )}
    </div>
  )
}

Inventory.propTypes = {
  items: array.isRequired,
  playerInventory: array,
  shopInventory: array,
}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <Inventory {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
/**
 * Adjusts feed efficiency or production rate based on player upgrades.
 * @param {number} manureManagerCount
 * @param {number} adjustedCowFeed
 * @returns {number} A multiplier or rate adjustment
 */
export const getCowEfficiencyMultiplier = (manureManagerCount, adjustedCowFeed) => {
  const manureBonus = 1 + manureManagerCount * 0.1; // 10% per manager
  const feedBonus = adjustedCowFeed > 0 ? 1.2 : 1.0; // 20% bonus if feed is available

  return manureBonus * feedBonus;
};