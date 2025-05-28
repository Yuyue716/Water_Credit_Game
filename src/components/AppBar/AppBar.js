import React, { useEffect, useState } from 'react'
import { tween } from 'shifty'
import { array, bool, func, number, string, object } from 'prop-types'

import { default as MuiAppBar } from '@mui/material/AppBar/index.js'
import Toolbar from '@mui/material/Toolbar/index.js'
import Typography from '@mui/material/Typography/index.js'
import StepIcon from '@mui/material/StepIcon/index.js'

import FarmhandContext from '../Farmhand/Farmhand.context.js'
import { moneyString } from '../../utils/moneyString.js'
import achievements from '../../data/achievements.js'

import './AppBar.sass'

/**
 * Displays formatted monetary value.
 *
 * @param {Object} props - The component props.
 * @param {number} props.money - The amount of money to display.
 */
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
    <Typography
      className="achievement-hint"
      variant="body1"
      style={{
        marginTop: '4px',
        color: '#fff',
        fontStyle: 'italic',
        textAlign: 'center',
        fontSize: '1rem',
      }}
    >
      Next Goal: {nextAchievement.description}
    </Typography>
  )
}

export const AppBar = ({
  handleClickNotificationIndicator,
  money,
  showNotifications,
  todaysNotifications,
  viewTitle,
  completedAchievements,

  areAnyNotificationsErrors = todaysNotifications.some(
    ({ severity }) => severity === 'error'
  ),
}) => (
  <MuiAppBar className="AppBar top-level" position="fixed">
    <Toolbar
      className="toolbar"
      style={{ width: '100%', flexDirection: 'column' }}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {!showNotifications && (
          <div
            className="notification-indicator-container"
            onClick={handleClickNotificationIndicator}
          >
            <Typography>
              <StepIcon icon={Math.max(0, todaysNotifications.length - 1)} />
            </Typography>
            {areAnyNotificationsErrors && (
              <Typography className="error-indicator">
                <StepIcon error icon="" />
              </Typography>
            )}
          </div>
        )}

        <Typography className="money-display" variant="h2">
          <MoneyDisplay money={money} />
        </Typography>
      </div>

      <Typography
        className="stage-header"
        variant="h2"
        style={{ textAlign: 'center', width: '100%' }}
      >
        {viewTitle}
      </Typography>

      <AchievementHint completedAchievements={completedAchievements} />
    </Toolbar>
  </MuiAppBar>
)

AppBar.propTypes = {
  handleClickNotificationIndicator: func.isRequired,
  money: number.isRequired,
  showNotifications: bool.isRequired,
  todaysNotifications: array.isRequired,
  viewTitle: string.isRequired,
  completedAchievements: object.isRequired,
}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <AppBar {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
