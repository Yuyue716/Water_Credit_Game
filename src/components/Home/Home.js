import React from 'react'

import { func, object } from 'prop-types'
import ReactMarkdown from 'react-markdown'
import globalWindow from 'global/window.js'
import Button from '@mui/material/Button/index.js'
import Divider from '@mui/material/Divider/index.js'
import Accordion from '@mui/material/Accordion/index.js'
import AccordionSummary from '@mui/material/AccordionSummary/index.js'
import AccordionDetails from '@mui/material/AccordionDetails/index.js'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore.js'
import Card from '@mui/material/Card/index.js'
import CardContent from '@mui/material/CardContent/index.js'

import { items } from '../../img/index.js'

import { achievementsMap } from '../../data/achievements.js'
import FarmhandContext from '../Farmhand/Farmhand.context.js'
import { STANDARD_LOAN_AMOUNT } from '../../constants.js'
import { stageFocusType } from '../../enums.js'
import { isDecember } from '../../utils/index.js'
import { memoize } from '../../utils/memoize.js'
import Achievement from '../Achievement/index.js'

import { SnowBackground } from './SnowBackground.js'
import './Home.sass'

const onboardingAchievements = [
  achievementsMap['plant-crop'],
  achievementsMap['water-crop'],
  achievementsMap['harvest-crop'],
  achievementsMap['purchase-cow-pen'],
]

const getRemainingOnboardingAchievements = memoize(completedAchievements =>
  onboardingAchievements.filter(
    achievement => achievement && !completedAchievements[achievement.id]
  )
)

const environmentAllowsInstall = ['production', 'development'].includes(
  import.meta.env?.MODE
)

const VALID_ORIGINS = [
  'https://jeremyckahn.github.io',
  'https://www.farmhand.life',
  'http://localhost:3000',
]

// https://stackoverflow.com/questions/41742390/javascript-to-check-if-pwa-or-mobile-web/41749865#41749865
const isInstallable =
  environmentAllowsInstall &&
  !globalWindow.matchMedia('(display-mode: standalone)').matches &&
  VALID_ORIGINS.includes(globalWindow.location.origin)

const Home = ({
  completedAchievements,
  handleViewChangeButtonClick,

  remainingOnboardingAchievements = getRemainingOnboardingAchievements(
    completedAchievements
  ),
}) => (
  <div className="Home">
    {isDecember() ? (
      <>
        <SnowBackground />
        <h1 className="holiday-greeting">
          Happy holidays!{' '}
          <span role="img" aria-label="Snowman">
            ⛄️
          </span>
        </h1>
      </>
    ) : (
      <h1>READ THE INSTRUCTIONS BEFORE PLAYING THE GAME</h1>
    )}
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <h2>Click to read a note from the developer</h2>
      </AccordionSummary>
      <AccordionDetails>
        <ReactMarkdown
          {...{
            linkTarget: '_blank',
            className: 'markdown',
            source: `
Hi, you're playing **WOWCOW**! This is an open source game project created by Jeremy Kahn and edited by project group HoTsPot. It simulates Water Credits, their role in livestock farming and other items/technology that is available in real-life and can help farmers save up more Water Credits.

This game is still in alpha version, so any opinions and suggestions are welcome!
    `,
          }}
        />
      </AccordionDetails>
    </Accordion>
    <Divider />
    <Card>
  <CardContent>
    <h3>Watch the WOWCOW Tutorial</h3>
    <div className="video-container">
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/Cof0FtUegKQ?si=L1I0G-cspfk22t9t"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
    </div>
  </CardContent>
</Card>
<Divider />
    <Card>
      <CardContent>
        <ReactMarkdown
          {...{
            className: 'markdown',
            linkTarget: '_blank',
            source: `
### What is WOWCOW?

WOWCOW is an educational game where you play as a farmer managing a dairy farm. The goal is to maximize profit while balancing water sustainability.

### Key Game Mechanics
#### 1. Buying Cows

  Each cow has a unique price, and only female ones produce milk. You can refresh available cows by advancing to the next day (red button).  

  
#### 2. Water Credits System

  Every cow consumes 1 water credit/day, representing water pollution from the manure. You have to buy enough water credit for all cows to be able to advance to the next day.  

#### 3. Sustainable Farming Practices

  You can adapt sustainable farming practices (using adjusted cow feed/manure manager) to earn more water credits and improve the sustainability level of your farm.

  A higher sustainability level allows you to sell your milk at a better price.
  `,
          }}
        />
        {remainingOnboardingAchievements.length ? (
          <>
            <ReactMarkdown
              {...{
                className: 'markdown',
                linkTarget: '_blank',
                source: `
### Getting started

It looks like you're new here. Thanks for stopping by! Here are some goals to help you get familiar with the game.
    `,
              }}
            />
            <ul className="card-list">
            </ul>
          </>
        ) : null}
      </CardContent>
    </Card>
    <Divider />

    <Card>
      <CardContent>
        <ReactMarkdown
          {...{
            className: 'markdown',
            linkTarget: '_blank',
            source: `
### A few other tips
* Follow the goals to enjoy the game in the best way possible.

* Press the red bed button in the top-right of the screen to end the farm day and advance the game. This also saves your progress.

* Your milk sustainability level aligns with your farms' sustainability level displayed at the navigation bar. 

* You can check your daily log, farm stats, and settings at the blue icons in the navigation bar.

* Make sure you feed your cows everyday, otherwise they will starve and run away!

* If you wish to restart the game, find the Settings button and at the very bottom you can delete your progress. Refresh the website to receive a new farm!

    `,
          }}
        />
        <Button
          {...{
            color: 'primary',
            onClick: () => handleViewChangeButtonClick(stageFocusType.COW_PEN),
            variant: 'contained',
          }}
        >
          Go to the Cow Pen
        </Button>
      </CardContent>
    </Card>
  </div>
)

Home.propTypes = {
  completedAchievements: object.isRequired,
  handleViewChangeButtonClick: func.isRequired,
}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <Home {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
