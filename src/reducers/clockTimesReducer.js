import initialState from './initialState'
import * as actionTypes from '../actions/actionTypes'
import moment from 'moment'

export default function clockTimes(state = initialState.clockTimes, action) {
  const createDayEntryIfMissing = (dayKey) => {
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
  switch (action.type) {
    case actionTypes.REMOVE_DAY: {
      const {[action.day] : entriesOfRemovedDay, ...otherDays} = state.days
      return {
        ...state,
        days: otherDays
      }
    }
    case actionTypes.REMOVE_CLOCK_TIME:
      const newEntries = state.days[action.day].slice(0)
      newEntries.splice(action.index, 1)
      return {
        ...state,
        days: {
          ...state.days,
          [action.day]: newEntries
        }
      }
    case actionTypes.ADD_CLOCK_TIME: {
      const midnight = moment(action.day).unix() * 1000
      return {
        ...state,
        days: {
          ...state.days,
          [action.day]: [...state.days[action.day], { in: midnight, out: midnight }]
        }
      }
    }
    case actionTypes.CHANGE_CLOCK_TIME: {
      const newEntries = state.days[action.day].slice(0)
      newEntries[action.index] = action.newValue
      return {
        ...state,
        days: {
          ...state.days,
          [action.day]: newEntries
        }
      }
    }
    case actionTypes.CLOCK_IN: {
      const dayKey = moment().format('YYYY-MM-DD')
      return createDayEntryIfMissing(dayKey)
    }
    case actionTypes.CLOCK_OUT:
    case actionTypes.ADD_PAUSE_TIME: {
      const state = createDayEntryIfMissing(action.day)
      const subtract = action.type === actionTypes.ADD_PAUSE_TIME ? action.duration : 0
      const day = [...state.days[action.day], { in: action.clockIn, out: new Date().getTime() - subtract }]

      return {
        ...state,
        days: {
          ...state.days,
          [action.day]: day
        }
      }
    }
    default:
      return state
  }
}