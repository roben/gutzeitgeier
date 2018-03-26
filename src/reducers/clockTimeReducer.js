import initialState from './initialState'
import * as actionTypes from '../actions/actionTypes'

export default function clockTime(state = initialState.clockTime, action) {
  switch (action.type) {
    case actionTypes.CLOCK_IN:
      return {
        ...state,
        clockIn: new Date().getTime()
      }
    case actionTypes.CLOCK_OUT:
      return {
        ...state,
        clockIn: null
      }
    default:
      return state
  }
}