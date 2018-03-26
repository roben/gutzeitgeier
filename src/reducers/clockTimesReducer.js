import initialState from './initialState'
import * as actionTypes from '../actions/actionTypes'
import moment from 'moment'

export default function clockTimes(state = initialState.clockTimes, action) {
  switch (action.type) {
    case actionTypes.CLOCK_IN: {
      const dayKey = moment().format('YYYY-MM-DD')
      if (dayKey in state.days) {
        return state
      }
      return {
        ...state,
        days: {
          ...state.days,
          [dayKey]: []
        }
      }
    }
    case actionTypes.CLOCK_OUT:
    case actionTypes.ADD_PAUSE_TIME: {
      const dayKey = moment(action.clockIn).format('YYYY-MM-DD')
      const subtract = action.type === actionTypes.ADD_PAUSE_TIME ? action.duration : 0
      const day = [...state.days[dayKey], { in: action.clockIn, out: new Date().getTime() - subtract }]
      return {
        ...state,
        days: {
          ...state.days,
          [dayKey]: day
        }
      }
    }
    default:
      return state
  }
}