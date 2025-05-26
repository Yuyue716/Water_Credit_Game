import { MANURE_MANAGER_ID, ADJUSTED_COW_FEED_ITEM_ID } from '../constants.js';

export const countManureManagers = (inventory = []) =>
  inventory.filter(({ id }) => id === MANURE_MANAGER_ID).length;

export const getAdjustedCowFeedQuantity = (inventory = []) => {
  const adjustedcowFeed = inventory.find(({ id }) => id === ADJUSTED_COW_FEED_ITEM_ID);
  return adjustedcowFeed ? adjustedcowFeed.quantity : 0;
}
