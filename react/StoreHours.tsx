import React, { useContext } from 'react'
import type { IntlShape } from 'react-intl'
import {
  defineMessages,
  FormattedDate,
  FormattedMessage,
  injectIntl,
} from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { StoreContext } from './contexts/StoreContext'

const CSS_HANDLES = [
  'hoursContainer',
  'hoursNormalHours',
  'hoursHolidayHours',
  'hoursLabel',
  'hoursHolidayHoursLabel',
  'hoursRow',
  'hoursDayOfWeek',
  'hoursText',
] as const

interface StoreHoursProps {
  intl: IntlShape
}

const StoreHours: StorefrontFunctionComponent<StoreHoursProps> = ({ intl }) => {
  const { handles } = useCssHandles(CSS_HANDLES)
  const store = useContext(StoreContext)

  if (!store) {
    return null
  }

  const storeHoursDisplay = (hours: BusinessHour | HolidayHour) => {
    if (!hours.openIntervals.length) {
      return (
        <FormattedMessage id="store/geocms-store-locator.storeHours.closed" />
      )
    }

    return hours.openIntervals.map((openInterval, i) => {
      const separator = i > 0 ? ' / ' : ''

      return `${separator}${openInterval.open} - ${openInterval.close}`
    })
  }

  return (
    <div className={`${handles.hoursContainer} mh5`}>
      <div className={handles.hoursNormalHours}>
        <div className={`b mb5 t-heading-6 ${handles.hoursLabel}`}>
          {
            <FormattedMessage id="store/geocms-store-locator.storeHours.hoursLabel" />
          }
        </div>
        <div>
          {store.businessHours.map((hours, i) => {
            return (
              <div
                key={`hour_${i}`}
                className={`${handles.hoursRow} mv2 flex justify-between`}
              >
                <div className={handles.hoursDayOfWeek}>
                  {new Intl.DateTimeFormat(intl.locale, {
                    weekday: 'long',
                  }).format(new Date(0, 0, hours.day))}
                </div>
                <div className={handles.hoursText}>
                  {storeHoursDisplay(hours)}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {store.holidayHours?.length > 0 && (
        <div className={handles.hoursHolidayHours}>
          <div
            className={`b mv5 t-heading-7 ${handles.hoursHolidayHoursLabel}`}
          >
            <FormattedMessage id="store/geocms-store-locator.storeHours.holidayLabel" />
          </div>
          <div>
            {store.holidayHours.map((holiday, i) => {
              return (
                <div
                  key={`hour_${i}`}
                  className={`${handles.hoursRow} mv2 flex justify-between`}
                >
                  <div className={handles.hoursDayOfWeek}>
                    {holiday.date && (
                      <FormattedDate
                        month="short"
                        day="2-digit"
                        value={holiday.date}
                      />
                    )}
                  </div>
                  <div className={handles.hoursText}>
                    {storeHoursDisplay(holiday)}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.storeHours.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.storeHours.description',
  },
})

StoreHours.schema = {
  title: messages.title.id,
  description: messages.description.id,
  type: 'object',
}

export default injectIntl(StoreHours)
