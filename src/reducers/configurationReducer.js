import initialState from './initialState'
import { CONFIGURATION_CHANGE_WORKING_HOURS } from '../actions/actionTypes';

export default function configuration(state = initialState.configuration, action) {
  switch (action.type) {
    case CONFIGURATION_CHANGE_WORKING_HOURS:
      return {
        ...state,
        workingHours: action.workingHours
      }
    default:
      return state
  }
}