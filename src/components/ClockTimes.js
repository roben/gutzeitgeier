import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'
import './ClockTimes.css'
import Typography from 'material-ui/Typography'
import moment from 'moment'

import Icon from 'material-ui/Icon'
import TimeDuration from './TimeDuration';
import { Card, CardContent } from 'material-ui';


class ClockTimes extends React.Component {
  render = () => (
    <div className="ClockTimes">
      {Object.keys(this.props.state.days).sort().reverse().map(d =>
        <Card key={d}>
          <CardContent>
            <Typography variant="caption" gutterBottom>{moment(d).format('dddd, DD.MM.YYYY')}</Typography>
            <Typography variant="body2" gutterBottom color="textSecondary">
            {this.props.state.days[d].map((ct, i) =>
              <div key={i} className="ClockTimes-day-entry">
                <div><Icon color="disabled">play_arrow</Icon> {moment(ct.in).format('HH:mm')}</div>
                <div><Icon color="disabled">pause</Icon> {moment(ct.out).format('HH:mm')}</div>
                <div><Icon color="disabled">timer</Icon> <TimeDuration value={ct.out - ct.in} /></div>
              </div>
            )}
            </Typography>
            <Typography variant="body2">
              <div className="ClockTimes-day-summary">
                <Icon color="disabled">timelapse</Icon>
                <TimeDuration value={this.props.state.days[d].map(ct => ct.out - ct.in).reduce((a, b) => a + b)} />
              </div>
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
  (state) => ({ state: state.clockTimes }),
  (dispatch) => ({})
)(ClockTimes)