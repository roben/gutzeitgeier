
import { createSelector } from 'reselect'

const getWorkingHours = (state) => state.configuration.workingHours
export const getWorkingHoursPerDay = createSelector([getWorkingHours],(workingHours) => workingHours / 5)
export const getWorkingMsPerDay = createSelector([getWorkingHoursPerDay],(wh) => wh * 60 * 60 * 1000)

const getPauses = (state) => state.configuration.pauses

export const getMinimumWorkDurationWithPausesMs = createSelector(
  [getPauses, getWorkingMsPerDay],
  (pauses, workMs) => {
    let pauseTarget = 0
    pauses.forEach((p, i) => {
      if (p.after < workMs) {
        pauseTarget += p.duration
      }
    })
    return workMs + pauseTarget
  }
)
