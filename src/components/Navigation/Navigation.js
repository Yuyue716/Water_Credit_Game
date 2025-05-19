import React, { useState, useEffect } from 'react'
import classNames from 'classnames'

import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import AssessmentIcon from '@mui/icons-material/Assessment'
import BeenhereIcon from '@mui/icons-material/Beenhere'
import BookIcon from '@mui/icons-material/Book'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Fab from '@mui/material/Fab'
import FlashOnIcon from '@mui/icons-material/FlashOn'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import SettingsIcon from '@mui/icons-material/Settings'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { array, bool, func, number, string } from 'prop-types'

import FarmhandContext from '../Farmhand/Farmhand.context'
import {
  doesInventorySpaceRemain,
  integerString,
  inventorySpaceConsumed,
} from '../../utils'
import { dialogView } from '../../enums'
import { INFINITE_STORAGE_LIMIT, STAGE_TITLE_MAP } from '../../constants'

import AccountingView from '../AccountingView'
import AchievementsView from '../AchievementsView'
import LogView from '../LogView'
import PriceEventView from '../PriceEventView'
import SettingsView from '../SettingsView'
import StatsView from '../StatsView'
import KeybindingsView from '../KeybindingsView'

import DayAndProgressContainer from './DayAndProgressContainer'

import './Navigation.sass'

const FarmNameDisplay = ({ farmName, handleFarmNameUpdate }) => {
  const [displayedFarmName, setDisplayedFarmName] = useState(farmName)

  useEffect(() => {
    setDisplayedFarmName(farmName)
  }, [farmName, setDisplayedFarmName])

  return (
    <h2 className="farm-name">
      <TextField
        variant="standard"
        {...{
          inputProps: {
            maxLength: 12,
          },
          onChange: ({ target: { value } }) => {
            setDisplayedFarmName(value)
          },
          onBlur: ({ target: { value } }) => {
            handleFarmNameUpdate(value)
          },
          placeholder: 'Farm Name',
          value: displayedFarmName,
        }}
      />{' '}
      Farm
    </h2>
  )
}

const {
  FARMERS_LOG,
  PRICE_EVENTS,
  STATS,
  ACHIEVEMENTS,
  ACCOUNTING,
  SETTINGS,

  // Has no UI trigger
  KEYBINDINGS,
} = dialogView

// The labels here must be kept in sync with mappings in initInputHandlers in
// Farmhand.js.
const dialogTriggerTextMap = {
  [FARMERS_LOG]: "Open Farmer's Log (l)",
  [PRICE_EVENTS]: 'See Price Events (e)',
  [STATS]: 'View your stats (s)',
  [ACHIEVEMENTS]: 'View Achievements (a)',
  [ACCOUNTING]: 'View Bank Account (b)',
  [SETTINGS]: 'View Settings (comma)',
}

const dialogTitleMap = {
  [FARMERS_LOG]: "Farmer's Log",
  [PRICE_EVENTS]: 'Price Events',
  [STATS]: 'Farm Stats',
  [ACHIEVEMENTS]: 'Achievements',
  [ACCOUNTING]: 'Bank Account',
  [SETTINGS]: 'Settings',

  // Has no UI trigger
  [KEYBINDINGS]: 'Keyboard Shortcuts',
}

const dialogContentMap = {
  [FARMERS_LOG]: <LogView />,
  [PRICE_EVENTS]: <PriceEventView />,
  [STATS]: <StatsView />,
  [ACHIEVEMENTS]: <AchievementsView />,
  [ACCOUNTING]: <AccountingView />,
  [SETTINGS]: <SettingsView />,

  // Has no UI trigger
  [KEYBINDINGS]: <KeybindingsView />,
}

export const Navigation = ({
  blockInput,
  currentDialogView,
  farmName,
  handleClickDialogViewButton,
  handleCloseDialogView,
  handleDialogViewExited,
  handleFarmNameUpdate,
  handleViewChange,
  inventory,
  inventoryLimit,
  isDialogViewOpen,
  stageFocus,
  viewList,

  currentDialogViewLowerCase = currentDialogView.toLowerCase(),
  modalTitleId = `${currentDialogViewLowerCase}-modal-title`,
  modalContentId = `${currentDialogViewLowerCase}-modal-content`,
}) => {
  return (
    <header className="Navigation">
      <h1>Farmhand</h1>
      <p className="version">
        v{import.meta.env?.VITE_FARMHAND_PACKAGE_VERSION}
      </p>
      <FarmNameDisplay {...{ farmName, handleFarmNameUpdate }} />
      <DayAndProgressContainer />

      {inventoryLimit > INFINITE_STORAGE_LIMIT && (
        <h3
          {...{
            className: classNames('inventory-info', {
              'is-inventory-full': !doesInventorySpaceRemain({
                inventory,
                inventoryLimit,
              }),
            }),
          }}
        >
          Inventory: {integerString(inventorySpaceConsumed(inventory))} /{' '}
          {integerString(inventoryLimit)}
        </h3>
      )}

      <Select
        variant="standard"
        {...{
          className: 'view-select',
          onChange: handleViewChange,
          value: stageFocus,
        }}
      >
        {viewList.map((view, i) => (
          <MenuItem {...{ key: view, value: view }}>
            {i + 1}: {STAGE_TITLE_MAP[view]}
          </MenuItem>
        ))}
      </Select>
      <div className="button-array">
        {[
          { dialogView: FARMERS_LOG, Icon: BookIcon },
          { dialogView: STATS, Icon: AssessmentIcon },
          { dialogView: ACCOUNTING, Icon: AccountBalanceIcon },
          { dialogView: SETTINGS, Icon: SettingsIcon },
        ].map(({ dialogView, Icon }) => (
          <Tooltip
            {...{
              arrow: true,
              key: dialogView,
              placement: 'top',
              title: dialogTriggerTextMap[dialogView],
            }}
          >
            <Fab
              {...{
                'aria-label': dialogTriggerTextMap[dialogView],
                color: 'primary',
                onClick: () => handleClickDialogViewButton(dialogView),
              }}
            >
              <Icon />
            </Fab>
          </Tooltip>
        ))}
      </div>
      {/*
      This Dialog gets the Farmhand class because it renders outside of the root
      Farmhand component. This explicit class maintains style consistency.
      */}
      <Dialog
        {...{
          className: classNames('Farmhand', { 'block-input': blockInput }),
          fullWidth: true,
          maxWidth: 'xs',
          onClose: handleCloseDialogView,
          open: isDialogViewOpen,
          TransitionProps: {
            onExited: handleDialogViewExited,
          },
        }}
        aria-describedby={modalTitleId}
        aria-labelledby={modalContentId}
      >
        <DialogTitle {...{ id: modalTitleId }}>
          {dialogTitleMap[currentDialogView]}
        </DialogTitle>
        <DialogContent {...{ id: modalContentId }}>
          {dialogContentMap[currentDialogView]}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogView} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </header>
  )
}

Navigation.propTypes = {
  blockInput: bool.isRequired,
  farmName: string.isRequired,
  handleClickDialogViewButton: func.isRequired,
  handleCloseDialogView: func.isRequired,
  handleDialogViewExited: func.isRequired,
  handleFarmNameUpdate: func.isRequired,
  handleViewChange: func.isRequired,
  inventory: array.isRequired,
  inventoryLimit: number.isRequired,
  isDialogViewOpen: bool.isRequired,
  stageFocus: string.isRequired,
  viewList: array.isRequired,
}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <Navigation {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
