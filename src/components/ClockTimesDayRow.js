import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'
import './ClockTimesDayRow.css'
import moment from 'moment'
import * as actionTypes from '../actions/actionTypes'

import Icon from 'material-ui/Icon'
import TimeDuration from './TimeDuration'
import { Button } from 'material-ui'
import TimeInput from 'material-ui-time-picker'


class ClockTimesDayRow extends React.Component {
  state = {
    deletionConfirmationShown: false,
    deletionConfirmationTimer: null
  }
  confirmDeletion = () => {
    this.setState({ deletionConfirmationShown: true })
    this.setState({
      deletionConfirmationTimer:
        setTimeout(() => {
          this.setState({ deletionConfirmationShown: false })
        }, 5000)
    })
  }
  removeClockTime = (d, ctIndex) => {
    if (this.state.deletionConfirmationTimer != null) {
      clearTimeout(this.state.deletionConfirmationTimer)
    }
    this.props.actions.removeClockTime(d, ctIndex)
  }
  changeClockTime = (d, ctIndex, prop, value) => {
    const ct = this.props.clockTimes.days[d][ctIndex]
    const newValue = value.getTime()
    this.props.actions.changeClockTime(d, ctIndex, { ...ct, [prop]: newValue })
  }
  render = () => {
    const ct = this.props.ct
    const d = this.props.day
    const ctIndex = this.props.ctIndex
    return <div className="ClockTimesDayRow">
      <div>
        <Icon color="disabled">play_arrow</Icon>
        <TimeInput
          defaultValue={moment(ct.in).toDate()}
          mode="24h"
          onChange={time => this.changeClockTime(d, ctIndex, 'in', time)} />
      </div>
      <div>
        <Icon color="disabled">pause</Icon>
        <TimeInput
          defaultValue={moment(ct.out).toDate()}
          mode="24h"
          onChange={time => this.changeClockTime(d, ctIndex, 'out', time)} />
      </div>
      <div><Icon color="disabled">timelapse</Icon> <TimeDuration value={ct.out - ct.in} /></div>
      <div>
        {!this.state.deletionConfirmationShown &&
          <Button size="small" onClick={() => this.confirmDeletion(d, ctIndex)}>
            <Icon color='error'>delete</Icon>
          </Button>
        }
        {this.state.deletionConfirmationShown &&
          <Button size="small" onClick={() => this.removeClockTime(d, ctIndex)}>
            <Icon color='error'>delete_forever</Icon>
          </Button>
        }
      </div>
    </div>
  }
}

ClockTimesDayRow.propTypes = {
  actions: PropTypes.object,
  state: PropTypes.object
}

export default connect(
  (state) => ({ clockTimes: state.clockTimes, currentClockIn: state.clockTime.clockIn }),
  (dispatch) => ({
    actions: {
      changeClockTime: (day, index, newValue) => dispatch({ type: actionTypes.CHANGE_CLOCK_TIME, day, index, newValue }),
      removeClockTime: (day, index) => dispatch({ type: actionTypes.REMOVE_CLOCK_TIME, day, index }),
    }
  })
)(ClockTimesDayRow)