import { castToMoney, moneyTotal } from '../../utils/index.js'
import { LOAN_INTEREST_RATE } from '../../constants.js'
import { LOAN_BALANCE_NOTIFICATION } from '../../templates.js'

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const applyLoanInterest = state => {
  const newLoanBalance = moneyTotal(
    state.loanBalance,
    castToMoney(state.loanBalance * LOAN_INTEREST_RATE)
  )

  // Notification removed
  const newDayNotifications = state.newDayNotifications

  return {
    ...state,
    loanBalance: newLoanBalance,
    newDayNotifications,
  }
}
