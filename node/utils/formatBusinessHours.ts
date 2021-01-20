import type { BusinessHours, Mktg } from '../typings/stores'

const DAY = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
} as const

export const formatBusinessHours = (mktg: Mktg) => {
  return Object.keys(DAY).reduce((hours: BusinessHours[], day) => {
    const current = {
      day: DAY[day as keyof typeof DAY],
      openIntervals: [],
      isClosed: false,
    } as BusinessHours

    if (mktg[`${day}_open`] && mktg[`${day}_close`]) {
      if (mktg[`${day}_morning_close`] && mktg[`${day}_afternoon_open`]) {
        current.openIntervals.push({
          open: mktg[`${day}_open`],
          close: mktg[`${day}_morning_close`],
        })
        current.openIntervals.push({
          open: mktg[`${day}_afternoon_open`],
          close: mktg[`${day}_close`],
        })
      } else {
        current.openIntervals.push({
          open: mktg[`${day}_open`],
          close: mktg[`${day}_close`],
        })
      }
    } else {
      current.isClosed = true
    }

    hours.push(current)

    return hours
  }, [])
}
