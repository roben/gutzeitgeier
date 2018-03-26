import initialState from './initialState'
import * as actionTypes from '../actions/actionTypes'
import moment from 'moment'

export default function clockTimes(state = initialState.clockTimes, action) {
  switch (action.type) {
    case actionTypes.CLOCK_OUT:
      const dayKey = moment(action.clockIn).format('YYYY-MM-DD')
      if (!(dayKey in state.days)) {
        state.days[dayKey] = []
      }
      const day = [...state.days[dayKey], { in: action.clockIn, out: new Date().getTime() }]
      return {
        ...state,
        days: {
          ...state.days,
          [dayKey]: day
        }
      }
    default:
      return state
  }
}