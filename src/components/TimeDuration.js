import { sprintf } from 'sprintf-js'
import React from 'react'

const TimeDuration = (props) => {
  const ms = Math.abs(props.value)
  const sign = props.value < 0 ? '-' : props.signed ? '+' : ''
  
  const totalSeconds = Math.round(ms / 1000)
  const seconds = totalSeconds % 60
  const minutes = Math.floor(totalSeconds / 60) % 60
  const hours = Math.floor(totalSeconds / 60 / 60) % 60
  let result
  if (props.seconds) {
    result = sprintf('%s%02d:%02d:%02d', sign, hours, minutes, seconds)
  } else {
    result = sprintf('%s%02d:%02d', sign, hours, minutes)
  }
  return <span className={props.className}>{result}</span>
}

export default TimeDuration