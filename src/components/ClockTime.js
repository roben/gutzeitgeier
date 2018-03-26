import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'
import * as actionTypes from '../actions/actionTypes'
import './ClockTime.css'
import Typography from 'material-ui/Typography'

import Icon from 'material-ui/Icon'
import Button from 'material-ui/Button'
import TimeDuration from './TimeDuration'

import moment from 'moment'


class ClockTime extends React.Component {
  state = {
    timer: null,
    currentDuration: null
  }
  getClockIn = () => this.props.clockTime.clockIn
  getCurrentWorkDuration = () => this.state.currentDuration
  getCurrentDayWorkDuration = () => {
    const dayKey = moment(this.getClockIn() ? this.getClockIn() : new Date()).format('YYYY-MM-DD')
    const day = this.props.clockTimes.days[dayKey]
    let result = this.getCurrentWorkDuration()
    if (day) {
      result += day.map((ct, i) => ct.out - ct.in).reduce((a, b) => a + b)
    }
    return result
  }
  updateDuration = () => {
    let currentDuration = null
    if (this.getClockIn()) {
      currentDuration = new Date().getTime() - this.getClockIn()
    }
    this.setState({ currentDuration })
  }
  componentDidMount = () => {
    this.setState({ timer: setInterval(this.updateDuration, 1000) })
  }
  clockOut = () => {
    this.props.clockTimeActions.clockOut(this.getClockIn())
  }
  getTotalWorkDurationTarget = () => this.props.configuration.workingHours / 5 * 60 * 60 * 1000
  getWorkEndTarget = () => {
    let result = this.getTotalWorkDurationTarget()
    this.props.configuration.pauses.forEach((p, i) => {
      if (p.after < result) {
        result += p.duration
      }
    })
    return result + this.getClockIn()
  }
  getWorkDurationBalance = () => this.getCurrentDayWorkDuration() - this.getTotalWorkDurationTarget()
  render = () => (
    <div className="ClockTime">
      <div className="ClockTime-clock">
        <Typography color="inherit" variant="headline" gutterBottom className="ClockTime-clock-running icon-flex">
          <Icon>timelapse</Icon> <TimeDuration seconds value={this.getCurrentDayWorkDuration()} />
        </Typography>
        <Typography color="inherit" variant="subheading" gutterBottom className="ClockTime-clock-balance icon-flex">
          <Icon></Icon> <TimeDuration seconds value={this.getWorkDurationBalance()} />
        </Typography>
        <Typography color="inherit" variant="subheading" gutterBottom className="ClockTime-clock-off-time icon-flex">
          <Icon>home</Icon> {moment(this.getWorkEndTarget()).format('HH:mm')}
        </Typography>
        {this.getClockIn() &&
          <Typography color="inherit" variant="subheading" gutterBottom className="ClockTime-clock-running icon-flex">
            <Icon>play_arrow</Icon> <TimeDuration seconds value={this.getCurrentWorkDuration()} />
          </Typography>
        }
      </div>
      <div className="ClockTime-button-container">
        {!this.getClockIn() &&
          <div>
            <Button variant="fab" className="ClockTime-button" color="primary" onClick={this.props.clockTimeActions.clockIn}><Icon>play_arrow</Icon></Button>
          </div>
        }
        {this.getClockIn() &&
          <div>
            <Button variant="fab" className="ClockTime-button" color="secondary" onClick={this.clockOut}><Icon>pause</Icon></Button>
          </div>
        }
      </div>
    </div>
  )
}

ClockTime.propTypes = {
  clockTimeActions: PropTypes.object,
  state: PropTypes.object,
  configuration: PropTypes.object
}

export default connect(
  (state) => ({ clockTime: state.clockTime, clockTimes: state.clockTimes, configuration: state.configuration }),
  (dispatch) => ({
    clockTimeActions: {
      clockIn: () => dispatch({ type: actionTypes.CLOCK_IN }),
      clockOut: (clockIn) => dispatch({ type: actionTypes.CLOCK_OUT, clockIn })
    }
  })
)(ClockTime)