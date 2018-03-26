import React, { Component } from 'react'
import './App.css'
import ClockTime from './components/ClockTime'
import ClockTimes from './components/ClockTimes'
import WorkingHours from './components/WorkingHours'
import CssBaseline from 'material-ui/CssBaseline';

class App extends Component {
  render() {
    return (
      <div className="App">
        <CssBaseline />
        <div className="App-header">
          <ClockTime />
          <WorkingHours />
        </div>
        <ClockTimes />
      </div>
    )
  }
}

export default App
