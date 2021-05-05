import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'
import * as actionTypes from '../actions/actionTypes'
import './ClockTimes.css'

import { Button } from '@material-ui/core'
import { FormControl, TextField } from '@material-ui/core';
import './WorkingHours.css';


class WorkingHours extends React.Component {
	state = {
		inputEnabled: false
	}
	onHoursChange = (e) => {
		this.props.actions.changeWorkingHours(e.target.value);
	}
	toggleInput = (e) => {
		this.setState({
			inputEnabled: !this.state.inputEnabled
		})
	}
	render = () =>
		<div className="WorkingHours">
			Wochenarbeitszeit
			{!this.state.inputEnabled &&
				<Button color="secondary" size="small" onClick={this.toggleInput}>
					{this.props.configuration.workingHours}h
				</Button>
			}
			{this.state.inputEnabled &&
				<form autoComplete="off" className="WorkingHours-form" >
					<FormControl>
						<TextField name="workingHours" type="number" value={this.props.configuration.workingHours} onChange={this.onHoursChange} />
					</FormControl>
				</form>
			}
		</div >
}

WorkingHours.propTypes = {
	configuration: PropTypes.object,
}

export default connect(
	(state) => ({ configuration: state.configuration }),
	(dispatch) => ({
		actions: {
			changeWorkingHours: (workingHours) => dispatch({ type: actionTypes.CONFIGURATION_CHANGE_WORKING_HOURS, workingHours })
		}
	})
)(WorkingHours)
