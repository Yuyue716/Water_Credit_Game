import React, { useEffect, useState } from 'react'
import { tween } from 'shifty'
import { array, bool, func, number, string, object } from 'prop-types'

import MuiAppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

import FarmhandContext from '../Farmhand/Farmhand.context.js'
import { moneyString } from '../../utils/moneyString.js'
import achievements from '../../data/achievements.js'

import './AppBar.sass'

const MoneyDisplay = ({ money }) => {
  const idleColor = 'rgb(255, 255, 255)'
  const [displayedMoney, setDisplayedMoney] = useState(money)
  const [textColor, setTextColor] = useState(idleColor)
  const [previousMoney, setPreviousMoney] = useState(money)
  const [currentTweenable, setCurrentTweenable] = useState()

  useEffect(() => {
    setPreviousMoney(money)
  }, [money])

  useEffect(() => {
    if (money !== previousMoney) {
      currentTweenable?.cancel()

      const tweenable = tween({
        easing: 'easeOutQuad',
        duration: 750,
        render: ({ color, money }) => {
          setTextColor(String(color))
          setDisplayedMoney(Number(money))
        },
        from: {
          color: money > previousMoney ? 'rgb(0, 255, 0)' : 'rgb(255, 0, 0)',
          money: previousMoney,
        },
        to: { color: idleColor, money },
      })

      setCurrentTweenable(tweenable)
    }

    return () => {
      currentTweenable?.cancel()
    }
  }, [money, previousMoney, currentTweenable])

  return <span style={{ color: textColor }}>{moneyString(displayedMoney)}</span>
}

const AchievementHint = ({ completedAchievements }) => {
  const [nextAchievement, setNextAchievement] = useState(null)

  useEffect(() => {
    const firstIncomplete = achievements.find(
      ach => !completedAchievements[ach.id]
    )
    setNextAchievement(firstIncomplete || null)
  }, [completedAchievements])

  if (!nextAchievement) return null

  return (
    <Typography className="achievement-hint" variant="body1">
      Next Goal: {nextAchievement.description}
    </Typography>
  )
}

export const AppBar = ({
  money,
  viewTitle,
  completedAchievements,
}) => (
  <MuiAppBar className="AppBar top-level" position="fixed">
    <Toolbar className="toolbar">
      <div className="left">
        <Typography className="view-title" variant="h2">{viewTitle}</Typography>
      </div>

      <div className="center">
        <AchievementHint completedAchievements={completedAchievements} />
      </div>

      <div className="right">
        <Typography className="money-display" variant="h2">
          <MoneyDisplay money={money} />
        </Typography>
      </div>
    </Toolbar>
  </MuiAppBar>
)

AppBar.propTypes = {
  money: number.isRequired,
  viewTitle: string.isRequired,
  completedAchievements: object.isRequired,
}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState }) => (
        <AppBar {...{ ...gameState, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
