import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'
import './ClockTimes.css'
import Typography from 'material-ui/Typography'
import moment from 'moment'
import * as actionTypes from '../actions/actionTypes'

import Icon from 'material-ui/Icon'
import TimeDuration from './TimeDuration'
import ClockTimesDayRow from './ClockTimesDayRow'
import { Card, CardContent, Button } from 'material-ui'


class ClockTimes extends React.Component {
  state = {
    timer: null,
    currentDuration: null
  }
  componentDidMount = () => {
    this.setState({ timer: setInterval(this.recalculate, 1000) })
  }
  recalculate = () => {
    this.setState({
      currentDuration: this.getCurrentClockInDurationMinutes()
    })
  }
  changeClockTime = (d, ctIndex, prop, value) => {
    const ct = this.props.clockTimes.days[d][ctIndex]
    const newValue = moment(value, 'HH:mm').unix() * 1000
    this.props.actions.changeClockTime(d, ctIndex, { ...ct, [prop]: newValue })
  }
  getCurrentClockInDurationMinutes = () => this.props.currentClockIn ? (new Date().getTime() - this.props.currentClockIn) / 1000 / 60 : 0
  render = () => (
    <div className="ClockTimes">
      {Object.keys(this.props.clockTimes.days).sort().reverse().map(d =>
        <Card key={d}>
          <CardContent>
            <Typography variant="caption" gutterBottom>{moment(d).format('dddd, DD.MM.YYYY')}</Typography>
            <Typography variant="body2" gutterBottom color="textSecondary">
              {this.props.clockTimes.days[d].map((ct, ctIndex) => <ClockTimesDayRow key={ctIndex} day={d} ct={ct} ctIndex={ctIndex} />)}
            </Typography>
            <Typography variant="body2" className="ClockTimes-row ClockTimes-day-summary">
              {this.state.currentDuration > 15 &&
                <Button onClick={() => this.props.actions.addPauseMinutes(d, 15, this.props.currentClockIn)} color='primary'>
                  <Icon>pause</Icon>
                  +15
                </Button>
              }
              {this.state.currentDuration > 30 &&
                <Button onClick={() => this.props.actions.addPauseMinutes(d, 15, this.props.currentClockIn)} color='primary'>
                  <Icon>pause</Icon>
                  +30
                </Button>
              }
              <Typography variant="body2" gutterBottom color="textSecondary">
                {this.props.clockTimes.days[d].length > 0 &&
                  <div className="icon-flex">
                    <Icon color="disabled">timelapse</Icon>
                    <TimeDuration color="disabled" value={this.props.clockTimes.days[d].map(ct => ct.out - ct.in).reduce((a, b) => a + b)} />
                  </div>
                }
              </Typography>
              <Button size="small" onClick={() => this.props.actions.addClockTimeEntry(d)}>
                <Icon>alarm_add</Icon>
              </Button>
            </Typography>
          </CardContent>
        </Card>
      )
      }
    </div >
  )
}

ClockTimes.propTypes = {
  actions: PropTypes.object,
  state: PropTypes.object
}

export default connect(
  (state) => ({ clockTimes: state.clockTimes, currentClockIn: state.clockTime.clockIn }),
  (dispatch) => ({
    actions: {
      addPauseMinutes: (day, durationMinutes, clockIn) => dispatch({ type: actionTypes.ADD_PAUSE_TIME, day, duration: durationMinutes * 60 * 1000, clockIn }),
      addClockTimeEntry: (day) => dispatch({ type: actionTypes.ADD_CLOCK_TIME, day }),
    }
  })
)(ClockTimes)