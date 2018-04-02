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
    currentDuration: null,
    currentDayWorkDuration: null
  }
  getCurrentDayKey = () => moment(this.getClockIn() ? this.getClockIn() : new Date()).format('YYYY-MM-DD')
  getClockIn = () => this.props.clockTime.clockIn
  getCurrentWorkDuration = () => this.state.currentDuration
  getCurrentDayEntries = () => {
    const result = this.props.clockTimes.days[this.getCurrentDayKey()]
    if (result != null && result.length > 0) {
      return result
    }
    return []
  }
  getCurrentDayWorkDuration = () => this.state.currentDayWorkDuration
  recalculate = () => {
    let currentDuration = null
    if (this.getClockIn()) {
      currentDuration = new Date().getTime() - this.getClockIn()
    }

    let currentDayWorkDuration = currentDuration
    let day = this.getCurrentDayEntries().filter(ct => ct.in != null && ct.out != null)
    if (day.length > 0) {
      currentDayWorkDuration += day.map((ct, i) => ct.out - ct.in).reduce((a, b) => a + b)
    }

    this.setState({ currentDuration, currentDayWorkDuration })
  }
  clockOut = () => {
    this.props.clockTimeActions.clockOut(this.getCurrentDayKey(), this.getClockIn())
  }
  getCurrentDayFirstClockIn() {

  }
  getWorkingHoursPerDay = () => this.props.configuration.workingHours / 5 * 60 * 60 * 1000
  getWorkEndTarget = () => {
    let workDuration = this.getWorkingHoursPerDay()
    let pauseTarget = 0
    this.props.configuration.pauses.forEach((p, i) => {
      if (p.after < workDuration) {
        pauseTarget += p.duration
      }
    })
    let base = this.getClockIn()
    let day = this.getCurrentDayEntries()
    if (day && day.length > 0) {
      base = Math.min(...day.map(d => d.in))
    }
    if (base == null) {
      base = new Date().getTime()
    }
    return workDuration + pauseTarget + base
  }
  getWorkDurationBalance = () => this.getCurrentDayWorkDuration() - this.getWorkingHoursPerDay()
  componentDidMount = () => {
    this.setState({ timer: setInterval(this.recalculate, 1000) })
  }
  render = () => (
    <div className="ClockTime">
      <div className="ClockTime-clock">
        <Typography color="inherit" variant="headline" gutterBottom className="ClockTime-clock-running icon-flex">
          <Icon>timelapse</Icon> <TimeDuration seconds value={this.getCurrentDayWorkDuration()} />
        </Typography>
        <Typography color="inherit" variant="subheading" gutterBottom className={(this.getWorkDurationBalance() < 0 ? 'negative' : 'positive') + ' ClockTime-clock-balance icon-flex'}>
          <Icon>restore</Icon> <TimeDuration value={this.getWorkDurationBalance()} />
        </Typography>
        <Typography color="inherit" variant="subheading" gutterBottom className="ClockTime-clock-off-time icon-flex">
          <Icon>home</Icon> {moment(this.getWorkEndTarget()).format('HH:mm')}
        </Typography>
        {false && this.getClockIn() &&
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
      clockOut: (day, clockIn) => dispatch({ type: actionTypes.CLOCK_OUT, day, clockIn })
    }
  })
)(ClockTime)