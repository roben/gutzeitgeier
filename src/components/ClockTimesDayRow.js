import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'
import './ClockTimesDayRow.css'
import moment from 'moment'
import * as actionTypes from '../actions/actionTypes'

import { Pause, Restore, DeleteForever, Delete, PlayArrow } from '@material-ui/icons'
import TimeDuration from './TimeDuration'
import { Button } from '@material-ui/core'
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

		const day = moment(d);
		// make sure the changed clock time has the same date as the clock day
		const valueMoment = moment(value).set({
			'year': day.year(),
			'month': day.month(),
			'date': day.date()
		});
		const newValue = valueMoment.unix() * 1000;
		this.props.actions.changeClockTime(d, ctIndex, { ...ct, [prop]: newValue })
	}
	render = () => {
		const ct = this.props.ct
		const d = this.props.day
		const ctIndex = this.props.ctIndex
		return <tr className="ClockTimesDayRow">
			<td>
				<div>
					<PlayArrow color="disabled" />
					<TimeInput
						defaultValue={moment(ct.in).toDate()}
						mode="24h"
						onChange={time => this.changeClockTime(d, ctIndex, 'in', time)} />
				</div>
			</td>
			<td>
				<div>
					<Pause color="disabled" />
					<TimeInput
						defaultValue={moment(ct.out).toDate()}
						mode="24h"
						onChange={time => this.changeClockTime(d, ctIndex, 'out', time)} />
				</div>
			</td>
			<td>
				<div>
					<Restore color="disabled" /> <TimeDuration value={ct.out - ct.in} />
				</div>
			</td>
			<td>
				<div>
					{!this.state.deletionConfirmationShown &&
						<Button size="small" onClick={() => this.confirmDeletion(d, ctIndex)}>
							<Delete color='error' />
						</Button>
					}
					{this.state.deletionConfirmationShown &&
						<Button size="small" onClick={() => this.removeClockTime(d, ctIndex)}>
							<DeleteForever color='error' />
						</Button>
					}
				</div>
			</td>
		</tr>
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
