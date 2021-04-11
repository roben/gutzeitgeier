import {combineReducers} from 'redux'
import clockTime from './clockTimeReducer'
import clockTimes from './clockTimesReducer'
import configuration from './configurationReducer'

const rootReducer = combineReducers({
  configuration,
  clockTime,
  clockTimes,
})

export default rootReducer