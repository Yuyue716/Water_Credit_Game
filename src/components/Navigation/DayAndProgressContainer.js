import React from 'react'
import { number, object } from 'prop-types'

import Box from '@mui/material/Box/index.js'
import CircularProgress from '@mui/material/CircularProgress/index.js'
import Tooltip from '@mui/material/Tooltip/index.js'
import {
  countManureManagers,
  getAdjustedCowFeedQuantity
} from '../../utils/InventoryHelpers'
import FarmhandContext from '../Farmhand/Farmhand.context.js'
import { getSustainabilityLevelFromMilk } from '../../utils/index.js'
import { levelAchieved } from '../../utils/levelAchieved.js'
import {
  experienceNeededForLevel,
  integerString,
  scaleNumber,
} from '../../utils/index.js'
import { EXPERIENCE_GAUGE_TOOLTIP_LABEL } from '../../templates.js'
/**
 * @param {farmhand.state} state
 * @returns {'A' | 'B' | 'C'}
 */
export const processSustainabilityLevel = state => {
  const manureManagerCount = countManureManagers(state.inventory)
  const adjustedCowFeed = getAdjustedCowFeedQuantity(state.inventory)
  const cowCount = state.cowInventory.length

  const level = getSustainabilityLevelFromMilk({
    manureManagerCount,
    adjustedCowFeed,
    cowCount,
  })

  console.log('→ Calculated sustainability level:', level)

  return level
}
export function DayAndProgressContainer({ dayCount, experience, itemsSold, inventory, cowInventory,}) {
  const currentLevel = levelAchieved(experience)
  const levelPercent = scaleNumber(
    experience,
    experienceNeededForLevel(currentLevel),
    experienceNeededForLevel(currentLevel + 1),
    0,
    100
  )

  const experiencePointsToNextLevel =
    experienceNeededForLevel(currentLevel + 1) - experience
  const nextLevel = currentLevel + 1
  const sustainabilityLevel = processSustainabilityLevel({
    inventory,
    cowInventory,
  })
  console.log('→ Calculated sustainability level:', sustainabilityLevel)
  const sustainabilityColors = {
    A: 'green',
    B: 'orange',
    C: 'red',
  }

  const letterColor = sustainabilityColors[sustainabilityLevel] || 'black'
  return (
    <div className="day-and-progress-container">
      <h2>
        <div>
          <span>Day {integerString(dayCount)}</span>
          </div>
        <div className="sustainability-info" >
          <span >Sustainability Level:</span> 
          <br/>
          <span style={{ color: letterColor }}>{sustainabilityLevel}</span>
        </div>
      </h2>
    </div>
  )

}

DayAndProgressContainer.propTypes = {
  dayCount: number.isRequired,
  experience: number.isRequired,
  itemsSold: object.isRequired,  
  inventory: object.isRequired,
  cowInventory: object.isRequired,
}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <DayAndProgressContainer {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
