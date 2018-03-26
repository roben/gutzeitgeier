import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'
import './ClockTimes.css'
import Typography from 'material-ui/Typography'
import moment from 'moment'
import * as actionTypes from '../actions/actionTypes'

import Icon from 'material-ui/Icon'
import TimeDuration from './TimeDuration';
import { Card, CardContent, Button } from 'material-ui';


class ClockTimes extends React.Component {
  state = {
    timer: null,
    currentDuration: null,
  }
  componentDidMount = () => {
    this.setState({ timer: setInterval(this.recalculate, 1000) })
  }
  recalculate = () => {
    this.setState({
      currentDuration: this.getCurrentClockInDurationMinutes()
    })
  }
  getCurrentClockInDurationMinutes = () => this.props.currentClockIn ? (new Date().getTime() - this.props.currentClockIn) / 1000 / 60 : 0
  render = () => (
    <div className="ClockTimes">
      {Object.keys(this.props.clockTimes.days).sort().reverse().map(d =>
        <Card key={d}>
          <CardContent>
            <Typography variant="caption" gutterBottom>{moment(d).format('dddd, DD.MM.YYYY')}</Typography>
            <Typography variant="body2" gutterBottom color="textSecondary">
              {this.props.clockTimes.days[d].map((ct, i) =>
                <div key={i} className="ClockTimes-day-entry ClockTimes-row">
                  <div><Icon color="disabled">play_arrow</Icon> {moment(ct.in).format('HH:mm')}</div>
                  <div><Icon color="disabled">pause</Icon> {moment(ct.out).format('HH:mm')}</div>
                  <div><Icon color="disabled">timelapse</Icon> <TimeDuration value={ct.out - ct.in} /></div>
                </div>
              )}
            </Typography>
            <Typography variant="body2" className="ClockTimes-row ClockTimes-day-summary">
              {this.state.currentDuration > 15 &&
                <Button onClick={() => this.props.actions.addPauseMinutes(15, this.props.currentClockIn)} color='primary'>
                  <Icon>pause</Icon>
                  +15
                </Button>
              }
              {this.state.currentDuration > 30 &&
                <Button onClick={() => this.props.actions.addPauseMinutes(15, this.props.currentClockIn)} color='primary'>
                  <Icon>pause</Icon>
                  +30
                </Button>
              }
              {this.props.clockTimes.days[d].length > 0 &&
                <div className="icon-flex">
                  <Icon color="disabled">timelapse</Icon>
                  <TimeDuration value={this.props.clockTimes.days[d].map(ct => ct.out - ct.in).reduce((a, b) => a + b)} />
                </div>
              }
            </Typography>
          </CardContent>
        </Card>
      )
      }
    </div >
  )
}

ClockTimes.propTypes = {
  clockTimeActions: PropTypes.object,
  state: PropTypes.object
}

export default connect(
  (state) => ({ clockTimes: state.clockTimes, currentClockIn: state.clockTime.clockIn }),
  (dispatch) => ({
    actions: {
      addPauseMinutes: (durationMinutes, clockIn) => dispatch({ type: actionTypes.ADD_PAUSE_TIME, duration: durationMinutes * 60 * 1000, clockIn }),
    }
  })
)(ClockTimes)