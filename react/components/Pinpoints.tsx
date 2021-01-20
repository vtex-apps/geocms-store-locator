/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react'
import type { IntlShape } from 'react-intl'
import { FormattedMessage, injectIntl } from 'react-intl'
import {
  GoogleMap,
  Marker,
  withGoogleMap,
  withScriptjs,
  InfoWindow,
} from 'react-google-maps'
import { useRuntime } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = [
  'markerInfo',
  'markerInfoLinkContainer',
  'markerInfoLink',
  'markerInfoAddressStreet',
  'markerInfoAddress',
  'markerInfoHours',
  'markerInfoDirectionsLink',
  'markerInfoStoreName',
  'markerInfoAddress',
] as const

interface PinpointProps {
  items: Store[]
  onChangeCenter: (lon: number, lat: number, zoomSize: number) => void
  zoom: number
  center: number[]
  icon: string
  iconWidth: string
  iconHeight: string
  intl: IntlShape
}

const Pinpoints = withScriptjs(
  withGoogleMap<PinpointProps>((props) => {
    const [state, setState] = useState<any>({
      markerState: {},
    })

    const handles = useCssHandles(CSS_HANDLES)

    const { navigate } = useRuntime()

    const handleMarkState = (id: string) => {
      const markerState = !state.markerState[id]
        ? {
            [id]: true,
          }
        : {}

      setState({
        markerState,
      })
    }

    const [lng, lat] = props.center
    const { intl, zoom } = props

    const goTo = (item: Store) => {
      navigate({
        page: 'store.storedetail',
        params: {
          store_id: item.id,
        },
      })
    }

    let icon: any = {
      url: props.icon ?? null,
    }

    if (props.iconWidth && props.iconHeight) {
      icon = {
        ...icon,
        scaledSize: {
          width: props.iconWidth,
          height: props.iconHeight,
        },
      }
    }

    return (
      <GoogleMap defaultZoom={10} zoom={zoom} center={{ lat, lng }}>
        {props.items.map((item, i: number) => {
          const { latitude, longitude } = item.location

          return (
            <Marker
              key={`marker_${i}`}
              icon={icon?.url}
              position={{ lat: latitude, lng: longitude }}
              onClick={() => {
                handleMarkState(item.id)
              }}
            >
              {(state.markerState[item.id] ||
                (Object.getOwnPropertyNames(state.markerState).length === 0 &&
                  lat === latitude &&
                  lng === longitude)) && (
                <InfoWindow
                  onCloseClick={() => {
                    handleMarkState(item.id)
                  }}
                >
                  <div className={`t-mini ${handles.markerInfo}`}>
                    <div className={`${handles.markerInfoLinkContainer}`}>
                      <span
                        className={`mt2 link c-link underline-hover pointer ${handles.markerInfoLink}`}
                        onClick={(e) => {
                          e.preventDefault()
                          goTo(item)
                        }}
                      >
                        {`${item.name} - ${item.address.city}`}
                      </span>
                    </div>
                    <br />
                    <div className={handles.markerInfoAddressStreet}>
                      {`${item.address.street},`}
                    </div>
                    <div className={handles.markerInfoAddress}>
                      {item.address.city ? `${item.address.city}` : ''}
                      {item.address.state ? `, ${item.address.state}` : ''}
                      {item.address.postalCode
                        ? ` ${item.address.postalCode}`
                        : ''}
                      <br />
                      {item.contacts.mainPhone
                        ? `${item.contacts.mainPhone}`
                        : ''}
                    </div>
                    <br />
                    {item.businessHours.map((hours, index: number) => {
                      return (
                        <div
                          key={`hour_${index}`}
                          className={handles.markerInfoHours}
                        >
                          <span
                            style={{ display: 'inline-block', width: '75px' }}
                            className=""
                          >
                            {new Intl.DateTimeFormat(intl.locale, {
                              weekday: 'long',
                            }).format(new Date(0, 0, hours.day))}
                            :
                          </span>
                          <span className="">
                            {hours.openIntervals.length ? (
                              hours.openIntervals.map((openInterval, idx) => {
                                const separator = idx > 0 ? ' / ' : ''

                                return `${separator}${openInterval.open} - ${openInterval.close}`
                              })
                            ) : (
                              <FormattedMessage id="store/geocms-store-locator.storeHours.closed" />
                            )}
                          </span>
                        </div>
                      )
                    })}
                    <br />
                    <a
                      className={`${handles.markerInfoDirectionsLink}`}
                      href={item.googleMapLink}
                    >
                      <FormattedMessage id="store/geocms-store-locator.pinpoints.directions" />
                    </a>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          )
        })}
      </GoogleMap>
    )
  })
)

export default injectIntl(Pinpoints)
