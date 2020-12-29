/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import {
  GoogleMap,
  Marker,
  withGoogleMap,
  withScriptjs,
} from 'react-google-maps'

interface MapProps {
  icon?: string
  iconWidth?: number
  iconHeight?: number
  center: StoreLocation
}

const Map = withScriptjs(
  withGoogleMap((props: MapProps) => {
    const { longitude: lng, latitude: lat } = props.center

    let icon = null

    if (props.icon) {
      icon = {
        url: props.icon,
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
    }

    return (
      <GoogleMap
        options={{ mapTypeControl: false, streetViewControl: false }}
        defaultZoom={14}
        center={{ lat, lng }}
      >
        <Marker icon={icon} position={{ lat, lng }} />
      </GoogleMap>
    )
  })
)

export default Map
