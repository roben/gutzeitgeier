import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'
import './ClockTimes.css'
import moment from 'moment'
import * as actionTypes from '../actions/actionTypes'

import { Pause, Timelapse, DeleteForever, Delete, AlarmAdd } from '@material-ui/icons'
import TimeDuration from './TimeDuration'
import ClockTimesDayRow from './ClockTimesDayRow'
import { Card, CardContent, Button, Typography } from '@material-ui/core'


class ClockTimes extends React.Component {
	state = {
		timer: null,
		currentDuration: null,
		dayDeletionConfirmation: null
	}
	confirmDeletion = (d) => {
		this.setState({ dayDeletionConfirmation: d })
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
							<table style={{width: '100%'}}>
								{this.props.clockTimes.days[d].map((ct, ctIndex) => <ClockTimesDayRow key={ctIndex} day={d} ct={ct} ctIndex={ctIndex} />)}
							</table>
						</Typography>
						<Typography variant="body2" className="ClockTimes-row ClockTimes-day-summary">
							{[15, 30, 45, 60].map((time) =>
								this.state.currentDuration > 0 &&
								<Button onClick={() => this.props.actions.addPauseMinutes(d, time, this.props.currentClockIn)} color='primary'>
									<Pause />
									{time}
								</Button>
							)}
							<Typography variant="body2" gutterBottom color="textSecondary">
								{this.props.clockTimes.days[d].length > 0 &&
									<div className="icon-flex">
										Soll&nbsp;
										<TimeDuration value={this.props.clockTimes.days[d].map(ct => ct.out - ct.in).reduce((a, b) => a + b)} />
										<Timelapse />
									</div>
								}
							</Typography>
							{this.props.clockTimes.days[d].length === 0 &&
								<div>
									{this.state.dayDeletionConfirmation === d &&
										<Button size="small" onClick={() => this.props.actions.removeDay(d)}>
											<DeleteForever color='error' />
										</Button>
									}
									{this.state.dayDeletionConfirmation !== d &&
										<Button size="small" onClick={() => this.confirmDeletion(d)}>
											<Delete color='error' />
										</Button>
									}
								</div>
							}
							<Button size="small" onClick={() => this.props.actions.addClockTimeEntry(d)}>
								Eintrag hinzufügen <AlarmAdd />
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
			removeDay: (day) => dispatch({ type: actionTypes.REMOVE_DAY, day }),
		}
	})
)(ClockTimes)
