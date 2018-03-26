export default {
  configuration: {
    workingHours: 38,
    pauses: [
      {after: 6 * 60 * 60 * 1000, duration: 0.5 * 60 * 60 * 1000},
      {after: 9 * 60 * 60 * 1000, duration: 0.25 * 60 * 60 * 1000},
    ]
  },
  clockTime: {
    clockIn: null
  },
  clockTimes: {
    days: {
      // '2018-03-21': [
      //   {in: new Date(2018,2,21,8,0).getTime(), out: new Date(2018,2,21,12,0).getTime()},
      //   {in: new Date(2018,2,21,12,30).getTime(), out: new Date(2018,2,21,17,35).getTime()}
      // ],
      // '2018-03-20': [
      //   {in: new Date(2018,2,20,8,0).getTime(), out: new Date(2018,2,20,12,0).getTime()},
      //   {in: new Date(2018,2,20,12,30).getTime(), out: new Date(2018,2,20,17,45).getTime()}
      // ],
      // '2018-03-19': [
      //   {in: new Date(2018,2,19,8,0).getTime(), out: new Date(2018,2,19,12,0).getTime()},
      //   {in: new Date(2018,2,19,12,30).getTime(), out: new Date(2018,2,19,17,21).getTime()}
      // ],
      // '2018-03-16': [
      //   {in: new Date(2018,2,16,8,0).getTime(), out: new Date(2018,2,16,12,0).getTime()},
      //   {in: new Date(2018,2,16,12,30).getTime(), out: new Date(2018,2,16,17,5).getTime()}
      // ],
    }
  },
}