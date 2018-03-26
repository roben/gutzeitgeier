import { sprintf } from 'sprintf-js'

const TimeDuration = (props) => {
  const ms = Math.abs(props.value)
  const sign = props.value < 0 ? '-' : props.signed ? '+' : ''
  
  const totalSeconds = Math.round(ms / 1000)
  const seconds = totalSeconds % 60
  const minutes = Math.floor(totalSeconds / 60) % 60
  const hours = Math.floor(totalSeconds / 60 / 60) % 60
  if (props.seconds) {
    return sprintf('%s%02d:%02d:%02d', sign, hours, minutes, seconds)
  }
  return sprintf('%s%02d:%02d', sign, hours, minutes)
}

export default TimeDuration